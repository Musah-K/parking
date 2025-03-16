import toast, { Toaster } from "react-hot-toast"
import { Route, Routes, useNavigate, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import { useMutation, useQuery } from "@apollo/client"
import { Authenticate } from "./graphql/query/userQuery"
import { useEffect } from "react"
import Client from "./pages/Client"
import Employee from "./pages/Employee"
import Admin from "./pages/Admin"
import { UpdateExpired } from "./graphql/mutations/parkingSlotsMutation"
import Reserved from "./pages/Client/Reserved"
import Reserve from "./pages/Client/Reserve"
function App() {

  const [removeExpiredSlots, {loading: loadingUpdate, error}] = useMutation(UpdateExpired);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await removeExpiredSlots();
      } catch (error) {
        toast.error(error.message)
      }
    };
  
    fetchData();
  }, []);
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

    token ? children : <Navigate to='/login' />;

  const {data: userData, loading: loadingUser } = useQuery(Authenticate)
  let authenticated = 'user'

  useEffect(()=>{
    userData?.authUser? navigate('/'): navigate('/login')
    authenticated = userData?.authUser?.role;
  },[userData,navigate])

  return (
    <div className="">
       <Routes>
      <Route path="/" element={<Home user={userData?.authUser} />}>
        {authenticated === "user" ? (
          <Route element={<Client user={userData?.authUser} />}>
            <Route path="" element={<Reserved />} />
            <Route path="reserve" element={<Reserve />} />
          </Route>
        ) : authenticated === "worker" ? (
          <Route index element={<Employee />} />
        ) : (
          <Route index element={<Admin />} />
        )}
      </Route>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
      <Toaster />
    </div>
  )
}

export default App
