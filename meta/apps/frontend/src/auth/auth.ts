import { jwtDecode } from "jwt-decode";


export const auth = {
  setToken: (token: string): void => {
    localStorage.setItem("token", token);
  },

  getToken: (): string | null => {
    return localStorage.getItem("token");
  },

  removeToken: (): void => {
    localStorage.removeItem("token");
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("token");
  },

  getUserId:(): string =>{
    const token = localStorage.getItem('token');
    if(token == null)
    {
        return "";
    }
    const decoded = jwtDecode<{role:string,userId:string}>(token)
    return decoded.userId;
  }
};
