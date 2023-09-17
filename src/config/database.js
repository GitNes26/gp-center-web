import { useAuthContext } from "../context/AuthContext";
import Toast from "../utils/Toast";

const firebaseConfig = {
   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
   appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// const app = initializeApp(firebaseConfig);

// export const auth = getAuth(app);
// const { auth, setAuth } = useAuthContext();

export const login = async ({ email, password }) => {
   try {
      const res = await Axios.post(`/login`, {
         email,
         password
      });
      console.log("AxiosRes", res);

      if (res.data.data.status_code != 200 && !res.data.data.result.token) return Toast.Error("algo paso");
      localStorage.setItem("token", res.token);
      setAuth(res.data.data.result.user_id);
      return res.data.data;
   } catch (error) {
      console.log(error);
   }
};

export const register = async ({ username, email, password, role }) => {
   try {
      const res = await Axios.post(`/register`, {
         username,
         email,
         password,
         role
      });
      setWait(false);
      return res;
   } catch (error) {
      setWait(false);
      console.log(error);
      return Toast.Error("trono");
   }
};

export const logout = () => {
   localStorage.removeItem("token");
   setAuth(null);
};

const loggedInCheck = async () => {
   const token = localStorage.getItem("token") || null;
   Axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
   console.log("token", token);
   if (token == null || token == undefined) {
      const res = await Axios.get(`users/${user}`); //es el id
      if (res.data.data.status_code != 200) return setAuth(null);
      setAuth(res.data.data.result);
   }
};

// useEffect(() => {
//    const asyncCall = async () => await loggedInCheck();
//    asyncCall();
//    // let redirectTo = "/";
//    // if (user) redirectTo = "/admin";
//    // useRedirectTo(user, redirectTo);
// }, [user]);
