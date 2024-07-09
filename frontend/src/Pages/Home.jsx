import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { okaidia } from '@uiw/codemirror-theme-okaidia';
import { loadLanguage } from '@uiw/codemirror-extensions-langs';
import { IoLogOut } from "react-icons/io5";
import { HiSave } from "react-icons/hi";
import { GrPowerReset } from "react-icons/gr";
import { VscTriangleRight } from "react-icons/vsc";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function Home() {
  const [code, setCode] = useState('//type code here');
  // const [language, setLanguage] = useState('python3');
  const [output,setOutput]=useState('');
  const [input,setInput]=useState('');
  const [memory,setMemory]=useState('');
  const [cpuTime,setCpuTime]=useState('');
  const user_id = sessionStorage.getItem('id');
  const [iscompiled,setIsCompiled]=useState(false);
  const [error,setError]=useState(null);
  const [loading,setLoading]=useState(false);

  const navigate = useNavigate();

  const handleCodeChange = (newValue) => {
    setCode(newValue);
  };

  const handleInputChange = (value)=>{
    setInput(value);
  }

  // useEffect(()=>{

  //   const getCredit = async()=>{
  //       const res = await fetch("https://api.jdoodle.com/v1/credit-spent",{
  //           method:"POST",
  //           headers:{
  //               "Content-Type":"application/json",
  //           },
  //           body:JSON.stringify({
  //               clientId: "b736f53b7bb64ee4d9ef10e8342e9a3f",
  //               clientSecret: "c04683476db617d4b28395a799332190e3f49675c6615d9931d19340d8015672",
  //           })
  //       });
  //       console.log(res);
  //   }
  //   getCredit();

  // },[]);


const handleSubmit = async () => {

  if(output === ''|| memory === '' || cpuTime === ''){
      alert('Please run the code before submitting');
      return;
  }

  try {
        const res = await axios.post('/saveCode', {
            program: code,
            language:"python",
            input:input,
            cputime:cpuTime,
            memory:memory,
            output:output,
            iscompiled:iscompiled,
            user_id:user_id
        });
        if(res.data.message ==="success"){
            setCode('');
            setInput('');
            setOutput('');
            setMemory('');
            setCpuTime('');
            setIsCompiled(false);
            navigate('/activities');
        }
  } catch (error) {
      console.error('Error sending data to backend:', error);
  }
};


  const handleRun = async ()=>{
    setLoading(true);
    const data = {
        clientId: "b736f53b7bb64ee4d9ef10e8342e9a3f",
        clientSecret: "c04683476db617d4b28395a799332190e3f49675c6615d9931d19340d8015672",
        script:code,
        language: "python3",
        versionIndex: "0",
        stdin: input
        }
    try{
    const res = await axios.post('/runCode',data);
    // console.log(res,"res from run code");
    setLoading(false);
    setOutput(res.data.output);
    setMemory(res.data.memory);
    setCpuTime(res.data.cpuTime);
    setIsCompiled(res.data.isCompiled);
    setError(res.data.error);

    }catch(e){
        console.log(e)
    }
  }

    const handlereset = ()=>{
        setCode('');
        setInput('');
        setOutput('');
        setMemory('');
        setCpuTime('');
        setIsCompiled(false);
        setError(null);
    }

    const handleLogout = ()=>{
        sessionStorage.clear();
        localStorage.clear();
        navigate('/');
        
    }

    const getProgram = async()=>{
        const res = await axios.get('/getProgram',{params:{program_id:sessionStorage.getItem('program_id')}});
        setCode(res.data[0].program);
        setInput(res.data[0].input);
        setOutput(res.data[0].output);
        setMemory(res.data[0].memory);
        setCpuTime(res.data[0].cputime);
        sessionStorage.removeItem('program_id');
    }

    if(sessionStorage.getItem("program_id")){
        getProgram();
    }

    if(sessionStorage.getItem("id")==null){
      localStorage.clear();
      sessionStorage.clear();
        navigate('/');
    }


   
  return (
    <>
    <div className='bg-indigo-100 h-[100vh]' >
       <div className='w-full h-16 bg-indigo-400 flex justify-between items-center px-3'>
        <div className='flex items-center justify-evenly ml-5  bg-white mt-2 mb-2 rounded-md  '>
        <h1 className='cursor-pointer hover:bg-indigo-200 bg-indigo-300  h-fit font-semibold p-3 rounded-md hover:rounded-none  ' onClick={()=>{navigate("/dashboard")}}>Complie</h1>
        <h1 className='cursor-pointer h-fit p-3 hover:bg-indigo-100 ' onClick={()=>{navigate("/activities")}}>Activity</h1>
        </div>
        <div className='flex items-center gap-x-4'>
            {/* <div className='flex items-center gap-2  h-fit w-fit p-2 rounded-md  font-bold  '>Credit : </div> */}
            <button className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 h-fit w-fit p-2 rounded-md text-white font-medium ' onClick={handleLogout}>logout<IoLogOut /></button>
        </div>
       </div>
        <div className='flex gap-x-1 p-1 rounded-lg'>
            <div className='w-[65%] '>
            <CodeMirror
                value={code}
                height="85vh"
                width="100%"
                theme={okaidia}
                borderRadius='10px'
                style={{fontSize: '16px',lineHeight: '20px',borderRadius:'10px'}}
                extensions={[loadLanguage('tsx')]}
                onChange={handleCodeChange}
            />
            </div>  

          <div className='w-[35%] flex flex-col gap-y-2 p-2'>
            <div className='flex p-1  justify-between w-full bg-orange-400 border-orange-500 border-[3px] rounded-md'>
                <div className='flex gap-x-3'>
                <button className='hover:bg-slate-300 bg-white h-fit w-fit p-1 px-2 rounded-md font-bold cursor-pointer flex  items-center' onClick={handleRun}>Run<VscTriangleRight />                </button>
                <button className='hover:bg-slate-200 h-fit w-fit p-1 rounded-md cursor-pointer flex items-center gap-x-1' onClick={handlereset}>reset<GrPowerReset /></button>
                </div>
                <button className='hover:bg-slate-200  h-fit w-fit p-1 rounded-md font-semibold cursor-pointer flex gap-x-1 items-center' onClick={handleSubmit}>Save <HiSave /></button>
            </div>
            <div className='w-full flex flex-col gap-y-1 rounded-md'>
            <h1 className='flex pl-2 font-bold'>INPUT</h1>
                <textarea className='p-1 rounded-md border-indigo-600 border-[3px] bg-slate-100' placeholder='give input here' name="input" id="input" cols="27" rows="10" onChange={handleInputChange}>{input}</textarea>
            </div>
            <div className='w-full flex flex-col gap-y-1 rounded-md'>
               {error!=null ?<h1 className='flex pl-2 font-bold text-red-500'>ERROR</h1> :<h1 className='flex pl-2 font-bold' >OUTPUT</h1> }
              { loading? <h2 className='p-3 flex items-center justify-center border-[3px] rounded-md border-red-500 bg-slate-100 min-h-56 max-h-fit'>Loading...</h2> 
                :<div className='p-3 rounded-md border-indigo-600 border-[3px] bg-slate-100  min-h-56 max-h-fit'>{error!=null ? error:output}</div> }
            </div>
            <div className='w-full p-1 h-fit flex flex-col gap-y-1 rounded-md border-indigo-600 border-[3px] bg-slate-100'>
                <h1 className=''>Memory : <span className='font-bold ml-1'>{memory}</span> </h1>
                <hr className='border-indigo-600 border-[1px]' />
                <h1 className=''>CPU Time : <span className='font-bold'>{cpuTime}</span> </h1>
            </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Home;


