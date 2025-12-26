import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

// Folder operations
export function useFolders() {
  const { user } = useAuth();

  const getFolders = async (parentId?: string) => {
    let query = supabase.from('folders').select('*');
    
    if (parentId) {
      query = query.eq('parent_id', parentId);
    } else {
      query = query.is('parent_id', null);
    }
    
    const { data, error } = await query.order('name');
    return { data, error };
  };

  const createFolder = async (name: string, parentId?: string, spaceType: 'public' | 'department' | 'project' = 'public', options?: { badge?: string; badgeColor?: string }) => {
    const { data, error } = await supabase.from('folders').insert({
      name,
      parent_id: parentId || null,
      space_type: spaceType,
      badge: options?.badge,
      badge_color: options?.badgeColor,
      created_by: user?.id,
    }).select().single();
    
    return { data, error };
  };

  const updateFolder = async (id: string, updates: { name?: string; is_locked?: boolean }) => {
    const { data, error } = await supabase.from('folders').update(updates).eq('id', id).select().single();
    return { data, error };
  };

  const deleteFolder = async (id: string) => {
    const { error } = await supabase.from('folders').delete().eq('id', id);
    return { error };
  };

  const addFolderAdmin = async (folderId: string, userId: string) => {
    const { data, error } = await supabase.from('folder_admins').insert({
      folder_id: folderId,
      user_id: userId,
    }).select().single();
    return { data, error };
  };

  const getFolderAdmins = async (folderId: string) => {
    const { data, error } = await supabase.from('folder_admins').select(`
      *,
      profiles:user_id (id, name, email, department)
    `).eq('folder_id', folderId);
    return { data, error };
  };

  return { getFolders, createFolder, updateFolder, deleteFolder, addFolderAdmin, getFolderAdmins };
}

// Document operations
export function useDocuments() {
  const { user } = useAuth();

  const getDocuments = async (folderId?: string) => {
    let query = supabase.from('documents').select('*');
    
    if (folderId) {
      query = query.eq('folder_id', folderId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    return { data, error };
  };

  const createDocument = async (doc: {
    name: string;
    file_type: string;
    file_size?: string;
    file_url?: string;
    folder_id?: string;
    tags?: string[];
    summary?: string;
  }) => {
    const { data, error } = await supabase.from('documents').insert({
      ...doc,
      author_id: user?.id,
      author_name: user?.email?.split('@')[0],
    }).select().single();
    
    return { data, error };
  };

  const updateDocument = async (id: string, updates: { name?: string; tags?: string[]; summary?: string; is_locked?: boolean }) => {
    const { data, error } = await supabase.from('documents').update(updates).eq('id', id).select().single();
    return { data, error };
  };

  const deleteDocument = async (id: string) => {
    const { error } = await supabase.from('documents').delete().eq('id', id);
    return { error };
  };

  return { getDocuments, createDocument, updateDocument, deleteDocument };
}

// Project operations
export function useProjects() {
  const { user } = useAuth();

  const getProjects = async () => {
    const { data, error } = await supabase.from('projects').select(`
      *,
      folder:folder_id (id, name)
    `).order('created_at', { ascending: false });
    return { data, error };
  };

  const getProject = async (id: string) => {
    const { data, error } = await supabase.from('projects').select(`
      *,
      folder:folder_id (id, name),
      members:project_members (
        id,
        role,
        created_at,
        user:user_id (id, name, email, department)
      )
    `).eq('id', id).single();
    return { data, error };
  };

  const createProject = async (project: { name: string; description?: string; folder_id?: string }) => {
    const { data, error } = await supabase.from('projects').insert({
      ...project,
      created_by: user?.id,
    }).select().single();
    
    // Auto-add creator as admin
    if (data && user) {
      await supabase.from('project_members').insert({
        project_id: data.id,
        user_id: user.id,
        role: 'admin',
        added_by: user.id,
      });
    }
    
    return { data, error };
  };

  const addProjectMember = async (projectId: string, userId: string, role: 'super_admin' | 'admin' | 'editor' | 'viewer' = 'viewer') => {
    const { data, error } = await supabase.from('project_members').insert({
      project_id: projectId,
      user_id: userId,
      role,
      added_by: user?.id,
    }).select().single();
    return { data, error };
  };

  const updateProjectMemberRole = async (memberId: string, role: 'super_admin' | 'admin' | 'editor' | 'viewer') => {
    const { data, error } = await supabase.from('project_members').update({ role }).eq('id', memberId).select().single();
    return { data, error };
  };

  const removeProjectMember = async (memberId: string) => {
    const { error } = await supabase.from('project_members').delete().eq('id', memberId);
    return { error };
  };

  const getProjectMembers = async (projectId: string) => {
    const { data, error } = await supabase.from('project_members').select(`
      *,
      user:user_id (id, name, email, department, avatar_url)
    `).eq('project_id', projectId);
    return { data, error };
  };

  return { getProjects, getProject, createProject, addProjectMember, updateProjectMemberRole, removeProjectMember, getProjectMembers };
}

// Profile operations
export function useProfiles() {
  const getProfiles = async () => {
    const { data, error } = await supabase.from('profiles').select('*').order('name');
    return { data, error };
  };

  const getProfile = async (userId: string) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    return { data, error };
  };

  const updateProfile = async (userId: string, updates: { name?: string; department?: string; role?: string; employee_id?: string; avatar_url?: string }) => {
    const { data, error } = await supabase.from('profiles').update(updates).eq('id', userId).select().single();
    return { data, error };
  };

  const searchProfiles = async (query: string) => {
    const { data, error } = await supabase.from('profiles').select('*')
      .or(`name.ilike.%${query}%,email.ilike.%${query}%,department.ilike.%${query}%`)
      .order('name')
      .limit(20);
    return { data, error };
  };

  return { getProfiles, getProfile, updateProfile, searchProfiles };
}

// Activity log operations
export function useActivityLogs() {
  const { user } = useAuth();

  const logActivity = async (action: string, targetType: string, targetId?: string, targetName?: string, metadata?: Record<string, unknown>) => {
    const { error } = await supabase.from('activity_logs').insert({
      user_id: user?.id,
      action,
      target_type: targetType,
      target_id: targetId,
      target_name: targetName,
      metadata: metadata as any,
    });
    return { error };
  };

  const getRecentActivities = async (limit = 10) => {
    const { data, error } = await supabase.from('activity_logs').select(`
      *,
      user:user_id (id, name, email)
    `).order('created_at', { ascending: false }).limit(limit);
    return { data, error };
  };

  return { logActivity, getRecentActivities };
}

// Intelligence operations
export function useIntelligences() {
  const getIntelligences = async (type?: 'paper' | 'patent') => {
    let query = supabase.from('intelligences').select('*');
    
    if (type) {
      query = query.eq('type', type);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    return { data, error };
  };

  const createIntelligence = async (intel: {
    title: string;
    source: string;
    type: 'paper' | 'patent';
    tags?: string[];
    published_at?: string;
    abstract?: string;
    authors?: string[];
    patent_number?: string;
    status?: string;
  }) => {
    const { data, error } = await supabase.from('intelligences').insert(intel).select().single();
    return { data, error };
  };

  return { getIntelligences, createIntelligence };
}

// Department operations
export function useDepartments() {
  const getDepartments = async () => {
    const { data, error } = await supabase.from('departments').select('*').order('name');
    return { data, error };
  };

  const createDepartment = async (name: string, description?: string) => {
    const { data, error } = await supabase.from('departments').insert({ name, description }).select().single();
    return { data, error };
  };

  return { getDepartments, createDepartment };
}
