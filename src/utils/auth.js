export const fakeUser = {
    email: "test@billchain.com",
    password: "123456"
  };
  
  export const login = (email, password) => {
    if (email === fakeUser.email && password === fakeUser.password) {
      localStorage.setItem("user", JSON.stringify({ email }));
      return true;
    }
    return false;
  };
  
  export const logout = () => {
    localStorage.removeItem("user");
  };
  
  export const isAuthenticated = () => {
    return localStorage.getItem("user") !== null;
  };
  