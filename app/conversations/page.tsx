"use client"

import React from 'react'
import clsx from "clsx"

import useConversation from "../hooks/useConversation";
import EmpyState from "../components/EmpyState";

const Home = () => {
  const {isOpen} = useConversation();
  return (
    <div className={clsx(
      "lg:pl-80 h-full lg:block",
      isOpen ? "block" : "hidden"
    )}>
      <EmpyState />
    </div>
  )
}

export default Home;