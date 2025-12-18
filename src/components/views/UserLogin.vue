<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const store = useUserStore();
const router = useRouter();

const sentEmail = ref('');
const emailInput = ref('');
const codeInput = ref('');

const handleSendEmail = async () => {
  try {
    sentEmail.value = emailInput.value;
    await store.sendMagicCode(emailInput.value);
  } catch (err: any) {
    alert('Uh oh: ' + err.body?.message);
    sentEmail.value = '';
  }
};

const handleVerifyCode = async () => {
  console.log('signing in with magic code', sentEmail.value, codeInput.value);
  try {
    await store.signInWithMagicCode(sentEmail.value, codeInput.value);
    router.push('/');
  } catch (err: any) {
    codeInput.value = '';
    alert('Uh oh: ' + err.body?.message);
  }
};

</script>

<template>
  <div class="auth-container">
      <div class="card login-box">
        <form v-if="!sentEmail" @submit.prevent="handleSendEmail" class="auth-form">
          <h2 class="form-title">Let's log you in.</h2>
          <p class="form-description">
            Enter your email, and we'll send you a verification code.
          </p>
          <input
            v-model="emailInput"
            type="email"
            class="input"
            placeholder="Enter your email"
            required
            autofocus
          />
          <button type="submit" class="btn btn-primary">
            Send Code
          </button>
        </form>

        <form v-else @submit.prevent="handleVerifyCode" class="auth-form">
          <h2 class="form-title">Enter your code</h2>
          <p class="form-description">
            We sent an email to <strong>{{ sentEmail }}</strong>. Check your email, and
            paste the code you see.
          </p>
          <input
            v-model="codeInput"
            type="text"
            class="input"
            placeholder="123456..."
            required
            autofocus
          />
          <button type="submit" class="btn btn-primary">
            Verify Code
          </button>
        </form>
      </div>
    </div>
</template>

<style scoped>
.auth-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.signed-in {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

.greeting {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
}

.signed-out {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.login-box {
  max-width: 28rem;
  width: 100%;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin: 0;
  color: var(--text-light);
}

.form-description {
  color: #374151;
  margin: 0;
}

.input {
  width: 100%;
  border: 1px solid #d1d5db;
  padding: 0.5rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 1rem;
}

.input:focus {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.btn {
  padding: 1rem 2rem;
  font-weight: bold;
  border: none;
  cursor: pointer;
  border-radius: 0.25rem;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: var(--button-dark);
  color: var(--text-dark);
  width: 100%;
}

.btn-primary:hover {
  background-color: var(--button-dark-hover);
}

.error-message {
  color: red;
  font-size: 0.8rem;
  margin: 0;
}
</style>
