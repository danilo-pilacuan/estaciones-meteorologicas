import { defineStore } from 'pinia';
import { TUser } from 'src/components/models';
import { LocalStorage } from 'quasar';

export const useAuthStore = defineStore('user', {
  state: () => ({
    user: (LocalStorage.getItem('userStore') || {}) as TUser,
    // user: {
    //   id: 'string',
    //   userName: 'string',
    //   userCompleteName: 'string',
    //   userPassword: 'string',
    //   userEmail: 'string',
    //   createdAt: 'string',
    //   updatedAt: 'string',
    //   userType: 2,
    //   userState: 'string',
    // } as TUser,
    isLoggedIn: (LocalStorage.getItem('isLoggedIn') || false) as boolean,
    userJwt: (LocalStorage.getItem('userJwt') || '') as string,
  }),
  getters: {
    getuser: (state) => state.user,
    getJWT: (state) => state.userJwt,
    checkLogin: (state) => state.isLoggedIn,
    clearToken: (state) => state.isLoggedIn,
  },
  actions: {
    setType(type: number) {
      this.user.userType = type;
    },
    // setUser(userInput: TUser) {
    //   this.user = userInput;
    // },
    setUser(userInput: TUser) {
      LocalStorage.set('userStore', userInput);
      this.user = userInput;
    },
    setLogin(loginState: boolean) {
      LocalStorage.set('isLoggedIn', loginState);
      this.isLoggedIn = loginState;
    },
    setJWT(jwt: string) {
      LocalStorage.set('userJwt', jwt);
      this.userJwt = jwt;
    },
    logout() {
      LocalStorage.remove('userJwt');
      LocalStorage.remove('isLoggedIn');
      this.user = {} as TUser;
      this.isLoggedIn = false;
      this.userJwt = '';
    },
  },
});
