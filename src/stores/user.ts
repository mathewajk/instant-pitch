import { computed, ref, watch, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { init } from "@dorilama/instantdb-vue";
import schema from '../instant.schema.ts';

const APP_ID = import.meta.env.VITE_INSTANT_APP_ID;

export const useUserStore = defineStore('user', () => {

  const db = init({ appId: APP_ID, schema });
  const { user, isLoading, error } = db.useAuth();
  
  const isAdmin = computed(() => {
    return (user.value as any)?.is_admin ?? false;
  });

  const sendMagicCode = async (email: string) => {
    await db.auth.sendMagicCode({ email });
  }

  const signInWithMagicCode = async (email: string, code: string) => {
    await db.auth.signInWithMagicCode({ email, code });
  }
  
  const signOut = async () => {
    await db.auth.signOut(); 
  }

  const isSignedIn =  ref(false);
  watch(user, (newUser) => {
    isSignedIn.value = newUser !== null;
  });

  return { user, isSignedIn, isAdmin, isLoading, error, db, sendMagicCode, signInWithMagicCode, signOut }
})
