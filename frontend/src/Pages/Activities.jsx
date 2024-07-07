import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { IoLogOut } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

function Activities() {
    const [program, setprogram] = useState([])
    const [laoding, setloading] = useState(false)
    const navigate = useNavigate();

    const handleDelete = (id)=>{
        return async()=>{
            try{
                const res = await axios.delete('/deleteProgram',{params:{program_id:id}});
                if(res.data.message==="success"){
                    const newProgram = program.filter(p=>p.id!==id);
                    setprogram(newProgram);
                }
            }catch(e){
                console.log(e);
            }
        }
    }

    const handleEdit = (id)=>{
        return async()=>{
            window.alert("it may take some time to load the program , please wait");
            sessionStorage.setItem('program_id',id);
            navigate("/dashboard");
        }
    }

    useEffect(()=>{
        getActivites().then(
            (res)=>{
                setprogram(res.data)
                console.log(res.data);
            }
        ).catch((e)=>{
            console.log(e);
        })
    },[])

    const getActivites = async()=>{
        setloading(true);
        const res = await axios.get('/getPrograms',{params:{user_id:sessionStorage.getItem('id')}});
        setloading(false);
        return res;
    }

    function MyComponent( p ) {
        const formattedDate = new Date(p).toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
        return formattedDate;
        }

        const handleLogout = ()=>{
            sessionStorage.clear();
            localStorage.clear();
            navigate('/');
            
        }

  
    

  return (
    <div>
       <div className='w-full h-16 bg-indigo-400 flex justify-between items-center px-3'>
        <div className='flex items-center justify-evenly ml-5  bg-white mt-2 mb-2 rounded-md  '>
        <h1 className='cursor-pointer hover:bg-indigo-100  h-fit p-3 ' onClick={()=>{navigate("/dashboard")}}>Complie</h1>
        <h1 className='cursor-pointer h-fit p-3 bg-indigo-300 hover:bg-indigo-100 rounded-md hover:rounded-none font-semibold' onClick={()=>{navigate("/activities")}}>Activity</h1>
        </div>
        <div>
            <button className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 h-fit w-fit p-2 rounded-md text-white font-medium ' onClick={handleLogout}>logout<IoLogOut /></button>
        </div>
     </div>
     <div>
            <div className='flex flex-col ml-2 p-2 '>
                <div className='flex justify-between ml-2 w-full'>
                    <div className='flex gap-x-9 p-2 text-xl font-bold ml-3 bg-gray-300 w-[50%] rounded-md'>
                    <h1>Program Id</h1>
                    <h1>Date</h1>
                    <h1>Language</h1>
                    <h1>CPU Time</h1>
                    <h1>Memory</h1>
                    <h1>Status</h1>
                    </div>
                    <div className='flex font-bold text-xl w-[40%]'>
                        Actions
                    </div>
                </div>
               { laoding ? <h1 className='text-xl font-medium text-center flex items-center justify-center mt-7'>Loading...</h1> :
                
                    program.map((p)=>{
                        return(
                            <div key={p.id} className='w-full flex items-center justify-between ml-2 '>
                                <div className='w-[50%] mt-5 bg-slate-100 shadow-md text-xl rounded-md p-5 ml-3 flex gap-x-14'>
                                    <h1 className='ml-4'>{p.id}</h1>
                                    <h1>{MyComponent(p.date)}</h1>
                                    <h1>{p.language}</h1>
                                    <h1>{p.cputime}</h1>
                                    <h1 className=''>{p.memory}</h1>
                                    {p.iscompiled ? (
                                        <h1>Success!</h1>
                                    ) : (
                                        <h1>Error!</h1>
                                    )}
                                </div>
                                <div className='flex justify-items-start w-[40%] gap-x-2'>
                                    <button className='bg-indigo-500 hover:bg-indigo-400 text-white p-2 rounded-md mt-2 flex items-center gap-x-2' onClick={handleEdit(p.id)}>Edit <FaEdit /> </button>
                                    <button className='bg-red-500 hover:bg-red-600 text-white p-2 rounded-md mt-2 flex items-center gap-x-1' onClick={handleDelete(p.id)}>Delete <MdDeleteForever /></button>
                                </div>
                            </div>
                        )
                    }
                    )                    
                }
                {
                    program.length===0 && !laoding && <h1 className='text-xl font-medium text-center flex items-center justify-center mt-7'>No Activities</h1>
                }
               
            </div>

     </div>
    </div>
  )
}

export default Activities
