import React, { useContext, useEffect, useState } from "react";
import Layout from "../../Component/layout/Layout";
import myContext from "../../context/data/myContext";
import { Link } from "react-router-dom";
import Modal from "../../Component/modal/Modal";
import { useDispatch, useSelector } from "react-redux";
import { deleteFromCart } from "../../redux/CartSlice";
import { toast } from "react-toastify";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase/FireBaseConfig";
import swal from "sweetalert";

export default function Cart() {
  const context = useContext(myContext);
  const { mode } = context;
  const dispatch=useDispatch()
  const cartItem = useSelector((state) => state.cart);
  // console.log("👍👍", cartItem);
const user=JSON.parse(localStorage.getItem('user'))
  const deleteCart=(item)=>{
    dispatch(deleteFromCart(item))
    toast.success("Delete Cart")
  }

  useEffect(()=>{
    window.localStorage.setItem('cart',JSON.stringify(cartItem))
  },[cartItem])

  const [totalAmount,setTotalAmount]=useState(0)
  useEffect(()=>{
    let temp=0;
    cartItem.forEach((item)=>{
      temp=temp+parseInt(item.price)
    })
    setTotalAmount(temp)
  },[cartItem])
  const shipping=parseInt(100)
  const grandTotal=shipping+totalAmount;

  const [name,setName]=useState("")
  const [address,setAddress]=useState("")
  const [pincode,setPinecode]=useState("")
  const [phoneNumber,setPhoneNumber]=useState("")

  const buyNow=()=>{
    if(name===""|| address===""||  phoneNumber===""){
      toast.error("All field are required")
    }
    if(user){

    const addressInfo={
      name,
      address,
      pincode,
      phoneNumber,
      date:new Date().toLocaleDateString(
        "en-us",
        {
          month:"short",
          day:"2-digit",
          year:"numeric",
        }
      )
    }
    const orderInfo={
      cartItem,
      addressInfo,
      date:new Date().toLocaleDateString(
        "en-us",
        {
          month:'short',
          day:"2-digit",
          year:"numeric"
        }
      ),
        email:JSON.parse(window.localStorage.getItem("user")).email,
        userid:JSON.parse(window.localStorage.getItem("user")).uid,
    }
    
      try {
        addDoc(collection(db,'order'),orderInfo)
          // console.log('👌👌',JSON.parse(window.localStorage.getItem("user")).user.email)
          swal("Congratulation!", "You Purchase Successfully!", "success");
        
      } catch (error) {
        console.log(error)
      }
    }else{
      toast.error("You need to login first")
    }
    
  }
  return (
    <Layout>
      <div
        className="h-screen bg-gray-100 pt-5  overflow-auto"
        style={{
          backgroundColor: mode === "dark" ? "#282c34" : "",
          color: mode === "dark" ? "white" : "",
        }}
      >
        <h1 className="mb-10 text-center text-2xl font-bold ">Cart Items</h1>

        <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0 ">
          <div className="rounded-lg md:w-2/3 ">
            {cartItem.map((item, index) => (
              // console.log("cartItem",item),
              <div
                key={index}
                className="justify-between mb-6 rounded-lg border  drop-shadow-xl bg-white p-6  sm:flex  sm:justify-start"
                style={{
                  backgroundColor: mode === "dark" ? "rgb(32 33 34)" : "",
                  color: mode === "dark" ? "white" : "",
                }}
              >
                <img
                  src={item.imageUrl}
                  alt="product-image"
                  className="w-full sm:w-40 hover:scale-110 transition-scale-110  duration-300 ease-in-out rounded-2xl"
                />
                <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                  <div className="mt-5 sm:mt-0">
                    <h2
                      className="text-lg font-bold text-gray-900"
                      style={{ color: mode === "dark" ? "white" : "" }}
                    >
                      {item.title}
                    </h2>
                    <h2
                      className="text-sm  text-gray-900"
                      style={{ color: mode === "dark" ? "white" : "" }}
                    >
                      {item.description}
                    </h2>
                    <p
                      className="mt-1 text-xl font-bold text-gray-700"
                      style={{ color: mode === "dark" ? "white" : "" }}
                    >
                      ৳{item.price}
                    </p>
                  </div>
                  <div onClick={()=>deleteCart(item)} className="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </div>
                  >
                </div>
                
              </div>
              
            ))}
            
          </div>

          <div
            className="mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3"
            style={{
              backgroundColor: mode === "dark" ? "rgb(32 33 34)" : "",
              color: mode === "dark" ? "white" : "",
            }}
          >
            <div className="mb-2 flex justify-between">
              <p
                className="text-gray-700"
                style={{ color: mode === "dark" ? "white" : "" }}
              >
                Subtotal
              </p>
              <p
                className="text-gray-700"
                style={{ color: mode === "dark" ? "white" : "" }}
              >
                ৳{totalAmount}
              </p>
            </div>
            <div className="flex justify-between">
              <p
                className="text-gray-700"
                style={{ color: mode === "dark" ? "white" : "" }}
              >
                Shipping
              </p>
              <p
                className="text-gray-700"
                style={{ color: mode === "dark" ? "white" : "" }}
              >
                ৳{shipping}
              </p>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between mb-3">
              <p
                className="text-lg font-bold"
                style={{ color: mode === "dark" ? "white" : "" }}
              >
                Total
              </p>
              <div className>
                <p
                  className="mb-1 text-lg font-bold"
                  style={{ color: mode === "dark" ? "white" : "" }}
                >
                  ৳{grandTotal}
                </p>
              </div>
            </div>
            <Modal 
            name={name}
            address={address}
            pincode={pincode}
            phoneNumber={phoneNumber}
            setName={setName}
            setAddress={setAddress}
            setPinecode={setPinecode}
            setPhoneNumber={setPhoneNumber}
            buyNow={buyNow}
            />
          </div>
        </div>
      </div>
    </Layout>
    // <Layout>

    // </Layout>
  );
}
