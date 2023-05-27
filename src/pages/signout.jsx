import { useRouter } from "next/router";
import { useEffect, useContext } from "react";

import useMutation from "@/libs/frontend/useMutation"
// import LocalDatabase from '@/components/LocalDatabase';


export default function SignOut() {

  const [logout, {loading: logoutLoading, data:logoutData, error: logoutError}] = useMutation("/api/users/logout");

  // const localDatabase = useContext(LocalDatabase);

  const router = useRouter();

  useEffect(()=>{

    // localDatabase.setUser({
    //   name: null,
    //   email: null,
    //   role: null,
    //   avatar: null,
    // })

    logout();
    console.log('Logged out.');
    router.replace("/"); //router.push("/");
  },[logoutData, router])


  return (
    <></>
  )
}