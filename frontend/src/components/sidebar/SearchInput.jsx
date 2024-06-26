import React, { useState } from 'react';
import { FaSearch } from "react-icons/fa";
import useConversation from "../../zustand/useConversation";
import useGetConversation from "../../hooks/useGetConversations";
import toast from 'react-hot-toast';

function SearchInput() {
  const [search , setSearch] = useState("");

  const {setSelectedConversation} = useConversation();
  const {conversations} = useGetConversation();


  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!search)return;
    if(search.length < 3){
      return toast.error("Search term must be at least 3 characters long")
    }
    
    const conversation = conversations.find(c => typeof c.fullName === 'string' && c.fullName.toLowerCase().includes(search.toLowerCase()));

    if(conversation){
      setSelectedConversation(conversation);
      setSearch('');
    }else{
      toast.error("No such user found!")
    }
  }

  return (
    <form onSubmit={handleSubmit} className=' flex items-center gap-2'>
        <input type="text" placeholder='Search...' className='input input-bordered rounded-full bg-sky-950' name="" id="" 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        />
        <button type='submit' className='btn btn-circle bg-sky-950 '>
            <FaSearch className='outline-none'/>
        </button>
    </form>
  )
}

export default SearchInput


