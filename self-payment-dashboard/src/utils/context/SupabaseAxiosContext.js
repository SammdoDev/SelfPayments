'use client';

import React, { createContext, useContext } from 'react';
import axios from 'axios';

const SupabaseAxiosContext = createContext(null);

export const SupabaseAxiosProvider = ({ children }) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const axiosInstance = axios.create({
    baseURL: `${supabaseUrl}/rest/v1`,
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
  });

  const contextValue = {
    get: axiosInstance.get,
    post: axiosInstance.post,
    put: axiosInstance.put,
    delete: axiosInstance.delete,
  };

  return (
    <SupabaseAxiosContext.Provider value={contextValue}>
      {children}
    </SupabaseAxiosContext.Provider>
  );
};

export const useSupabaseAxios = () => {
  const context = useContext(SupabaseAxiosContext);
  if (!context) {
    throw new Error('useSupabaseAxios must be used within a SupabaseAxiosProvider');
  }
  return context;
};
