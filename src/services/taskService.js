// Table name from provided schema
const TABLE_NAME = 'task27';

// Client is initialized in the function to ensure it's available
const getClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Map backend fields to frontend model
const mapTaskFromBackend = (record) => {
  if (!record) return null;
  
  return {
    id: record.Id,
    title: record.title || '',
    description: record.description || '',
    priority: record.priority || 'medium',
    status: record.status || 'pending',
    dueDate: record.dueDate || null,
    createdAt: record.CreatedOn || new Date().toISOString(),
    updatedAt: record.ModifiedOn || new Date().toISOString()
  };
};

// Map frontend model to backend fields
const mapTaskToBackend = (task) => {
  const backendTask = {
    title: task.title,
    description: task.description || '',
    priority: task.priority || 'medium',
    status: task.status || 'pending',
    dueDate: task.dueDate
  };
  
  // Include ID for updates
  if (task.id) {
    backendTask.Id = task.id;
  }
  
  return backendTask;
};

/**
 * Fetches all tasks for the current user
 */
export const fetchTasks = async () => {
  try {
    const client = getClient();
    
    const params = {
      Fields: [
        { Field: { Name: "Id" } },
        { Field: { Name: "title" } },
        { Field: { Name: "description" } },
        { Field: { Name: "priority" } },
        { Field: { Name: "status" } },
        { Field: { Name: "dueDate" } },
        { Field: { Name: "CreatedOn" } },
        { Field: { Name: "ModifiedOn" } }
      ],
      orderBy: [
        {
          field: "dueDate",
          direction: "asc"
        }
      ],
      pagingInfo: {
        limit: 100,
        offset: 0
      }
    };
    
    const response = await client.fetchRecords(TABLE_NAME, params);
    
    if (!response || !response.data) {
      return [];
    }
    
    return response.data.map(mapTaskFromBackend);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

/**
 * Fetches a single task by ID
 */
export const fetchTaskById = async (taskId) => {
  try {
    const client = getClient();
    
    const params = {
      Fields: [
        { Field: { Name: "Id" } },
        { Field: { Name: "title" } },
        { Field: { Name: "description" } },
        { Field: { Name: "priority" } },
        { Field: { Name: "status" } },
        { Field: { Name: "dueDate" } },
        { Field: { Name: "CreatedOn" } },
        { Field: { Name: "ModifiedOn" } }
      ]
    };
    
    const response = await client.getRecordById(TABLE_NAME, taskId, params);
    
    if (!response || !response.data) {
      return null;
    }
    
    return mapTaskFromBackend(response.data);
  } catch (error) {
    console.error(`Error fetching task with ID ${taskId}:`, error);
    throw error;
  }
};

/**
 * Creates a new task
 */
export const createTask = async (taskData) => {
  try {
    const client = getClient();
    
    const backendTask = mapTaskToBackend(taskData);
    
    const params = {
      records: [backendTask]
    };
    
    const response = await client.createRecord(TABLE_NAME, params);
    
    if (!response || !response.success || !response.results || response.results.length === 0) {
      throw new Error('Failed to create task');
    }
    
    const createdTask = response.results[0];
    
    if (!createdTask.success) {
      const errorMessage = createdTask.errors ? 
        createdTask.errors.map(err => err.message).join(', ') : 
        'Unknown error occurred';
      throw new Error(errorMessage);
    }
    
    return mapTaskFromBackend(createdTask.data);
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

/**
 * Updates an existing task
 */
export const updateTask = async (taskData) => {
  try {
    const client = getClient();
    
    const backendTask = mapTaskToBackend(taskData);
    
    const params = {
      records: [backendTask]
    };
    
    const response = await client.updateRecord(TABLE_NAME, params);
    
    if (!response || !response.success || !response.results || response.results.length === 0) {
      throw new Error('Failed to update task');
    }
    
    const updatedTask = response.results[0];
    
    if (!updatedTask.success) {
      const errorMessage = updatedTask.errors ? 
        updatedTask.errors.map(err => err.message).join(', ') : 
        'Unknown error occurred';
      throw new Error(errorMessage);
    }
    
    return mapTaskFromBackend(updatedTask.data);
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

/**
 * Deletes a task by ID
 */
export const deleteTask = async (taskId) => {
  try {
    const client = getClient();
    
    const params = {
      RecordIds: [taskId]
    };
    
    const response = await client.deleteRecord(TABLE_NAME, params);
    
    if (!response || !response.success) {
      throw new Error('Failed to delete task');
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting task with ID ${taskId}:`, error);
    throw error;
  }
};