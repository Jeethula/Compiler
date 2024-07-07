import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { okaidia } from '@uiw/codemirror-theme-okaidia';
import { loadLanguage } from '@uiw/codemirror-extensions-langs';
import { IoLogOut } from "react-icons/io5";
import { HiSave } from "react-icons/hi";
import { GrPowerReset } from "react-icons/gr";
import { VscRunAll } from "react-icons/vsc";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function Home() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [output,setOutput]=useState('');
  const [input,setInput]=useState('');
  const [memory,setMemory]=useState('');
  const [cpuTime,setCpuTime]=useState('');
 const user_id = sessionStorage.getItem('id');
 const [iscompiled,setIsCompiled]=useState(false);

  const navigate = useNavigate();

  const handleCodeChange = (newValue) => {
    setCode(newValue);
  };

  const handleInputChange = (value)=>{
    setInput(value);
  }


//   function formatCodeForBackend(userCode) {
//     const formattedCode =userCode
//         .replace(/\\/g, "\\")  // Escape backslashes
//         .replace(/"/g, "\"")   // Escape double quotes
//         .replace(/\n/g, "\n")   // Convert newlines to escape sequences
//         .replace(/\t/g, "\t");  // Convert tabs to escape sequences

//     return formattedCode;
// }

const handleSubmit = async () => {
//   const formattedCode = formatCodeForBackend(code);
//   console.log(formattedCode)
  try {
        const res = await axios.post('/userCreate', {
            program: code,
            language:"python",
            input:input,
            cputime:cpuTime,
            memory:memory,
            output:output,
            iscompiled:iscompiled,
            user_id:user_id
        });
        console.log(res.data);
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
    try{
    const res = await fetch("https://api.jdoodle.com/v1/execute",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                 "Access-Control-Allow-Origin": "*",
                 noCors: true
            },
            body: JSON.stringify({
            clientId: "b736f53b7bb64ee4d9ef10e8342e9a3f",
            clientSecret: "c04683476db617d4b28395a799332190e3f49675c6615d9931d19340d8015672",
            script: code,
            language: "python3",
            versionIndex: "0",
            stdin: input
            }),
        }
    )
    console.log(res.output,"output")
    console.log(res)
    setOutput(res.output);
    setMemory(res.memory);
    setCpuTime(res.cpuTime);
    setIsCompiled(res.isCompiled);
    }catch(e){
        console.log(e)
    }
    setInput('');
  }

    const handlereset = ()=>{
        setCode('');
        setInput('');
        setOutput('');
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


   
  return (
    <>
    <div >
       <div className='w-full h-16 bg-indigo-400 flex justify-between items-center px-3'>
        <div className='flex items-center justify-evenly ml-5  bg-white mt-2 mb-2 rounded-md  '>
        <h1 className='cursor-pointer hover:bg-indigo-200 bg-indigo-300  h-fit font-semibold p-3 rounded-md hover:rounded-none  ' onClick={()=>{navigate("/dashboard")}}>Complie</h1>
        <h1 className='cursor-pointer h-fit p-3 hover:bg-indigo-100 ' onClick={()=>{navigate("/activities")}}>Activity</h1>
        </div>
        <div>
            <button className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 h-fit w-fit p-2 rounded-md text-white font-medium ' onClick={handleLogout}>logout<IoLogOut /></button>
        </div>
       </div>
        <div className='flex gap-x-1 p-1 rounded-lg'>
            <div className='w-[65%]'>
            <CodeMirror
                value={code}
                height="800px"
                width="100%"
                theme={okaidia}
                style={{fontSize: '16px',lineHeight: '20px'}}
                extensions={[loadLanguage('tsx')]}
                onChange={handleCodeChange}
            />
            </div>  

          <div className='w-[35%] flex flex-col gap-y-2'>
            <div className='flex p-1 px-3 justify-between w-full bg-slate-400 rounded-md'>
                <div className='flex gap-x-3'>
                <button className='bg-green-500 h-fit w-fit p-1 rounded-md font-semibold cursor-pointer flex gap-x-1 items-center' onClick={handleRun}>Run <VscRunAll /></button>
                <button className='cursor-pointer flex items-center gap-x-1' onClick={handlereset}>reset<GrPowerReset /></button>
                </div>
                <button className='bg-orange-400 h-fit w-fit p-1 rounded-md font-semibold cursor-pointer flex gap-x-1 items-center' onClick={handleSubmit}>Save & Submit <HiSave /></button>
            </div>
            <div className='w-full flex flex-col gap-y-1 rounded-md'>
            <h1 className='flex pl-2 font-bold'>INPUT</h1>
                <textarea className='p-1 rounded-sm bg-slate-100' placeholder='give input here' name="input" id="input" cols="27" rows="10" onChange={handleInputChange}>{input}</textarea>
            </div>
            <div className='w-full flex flex-col gap-y-1 rounded-md'>
                <h1 className='flex pl-2 font-bold' >OUTPUT</h1>
                <h2 className='p-1 rounded-sm bg-slate-100 min-h-56 max-h-fit'>{output}</h2>
            </div>
            <div className='w-full p-1 h-fit flex flex-col gap-y-1 rounded-md bg-slate-100'>
                <h1 className=''>Memory   : <span className='font-bold'>{memory}</span> </h1>
                <hr />
                <h1 className=''>CPU Time : <span className='font-bold'>{cpuTime}</span> </h1>
            </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Home;


