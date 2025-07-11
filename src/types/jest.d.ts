import '@jest/globals';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidJWT(): R;
    }
  }
} 