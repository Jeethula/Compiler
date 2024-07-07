// use express and connect with mongodg atlas
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
const PORT =  3002;

app.use(cors());
app.use(bodyParser.json());


  app.get('/', async (_, res) => {
    const pool = new Pool({
      connectionString: "postgresql://sample_owner:KqUaJp6WYvH9@ep-tight-firefly-a5h8flpg.us-east-2.aws.neon.tech/Code_Compiler?sslmode=require",
    });
    const client = await pool.connect();
    const result = await client.query('SELECT version()');
    client.release();
    const { version } = result.rows[0];
    res.json({ version });
  });

app.post('/userCreate',async(req,res)=>{
    const pool = new Pool({
        connectionString: "postgresql://sample_owner:KqUaJp6WYvH9@ep-tight-firefly-a5h8flpg.us-east-2.aws.neon.tech/Code_Compiler?sslmode=require",
        });
        const client = await pool.connect();
        const {username,email,password} = req.body;
        const result = await client.query('INSERT INTO users (username,email,password) VALUES ($1,$2,$3)',[username,email,password]);
        client.release();
        res.json({message:"success"});
}
);

app.get('/userLogin',async(req,res)=>{
    const pool = new Pool({
        connectionString:  "postgresql://sample_owner:KqUaJp6WYvH9@ep-tight-firefly-a5h8flpg.us-east-2.aws.neon.tech/Code_Compiler?sslmode=require"
    });
    const client = await pool.connect();
    // const {username,password} = req.query;
    const username = req.query.username;
    const password = req.query.password;
    const result = await client.query('SELECT * FROM users WHERE username=$1 AND password=$2',[username,password]);
    const id=result.rows[0].id;
    client.release();
    if(result.rows.length>0){
        res.json({message:true,id:id});
    }
    else{
        res.json({message:false});
    }
}
);

app.post('/saveCode',async(req,res)=>{
    const pool = new Pool({
        connectionString: "postgresql://sample_owner:KqUaJp6WYvH9@ep-tight-firefly-a5h8flpg.us-east-2.aws.neon.tech/Code_Compiler?sslmode=require",
        });
        const client = await pool.connect();
        const {program,language,input,cputime,memory,output,iscompiled,user_id} = req.body;
        const result = await client.query('INSERT INTO compiled_programs (program,language,input,cputime,memory,output,iscompiled,user_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',[program,language,input,cputime,memory,output,iscompiled,user_id]);
        client.release();
        res.json({message:"success"});
}
);

// get all programs of a specific user by user_id
app.get('/getPrograms',async(req,res)=>{
    const pool = new Pool({
        connectionString:  "postgresql://sample_owner:KqUaJp6WYvH9@ep-tight-firefly-a5h8flpg.us-east-2.aws.neon.tech/Code_Compiler?sslmode=require",
    });
    const client = await pool.connect();
    const user_id = req.query.user_id;
    const result = await client.query('SELECT * FROM compiled_programs WHERE user_id=$1',[user_id]);
    client.release();
    res.json(result.rows);
}
);

// get specific program by program_id
app.get('/getProgram',async(req,res)=>{
    const pool = new Pool({
        connectionString:"postgresql://sample_owner:KqUaJp6WYvH9@ep-tight-firefly-a5h8flpg.us-east-2.aws.neon.tech/Code_Compiler?sslmode=require",
    });
    const client = await pool.connect();
    const program_id = req.query.program_id;
    const result = await client.query('SELECT * FROM compiled_programs WHERE id=$1',[program_id]);
    client.release();
    res.json(result.rows);
}
);

// update specific program by program_id
app.put('/updateProgram',async(req,res)=>{
    const pool = new Pool({
        connectionString: "postgresql://sample_owner:KqUaJp6WYvH9@ep-tight-firefly-a5h8flpg.us-east-2.aws.neon.tech/Code_Compiler?sslmode=require",
        });
        const client = await pool.connect();
        const {program,language,input,cputime,memory,output,iscompiled,program_id} = req.body;
        const result = await client.query('UPDATE compiled_programs SET program=$1,language=$2,input=$3,cputime=$4,memory=$5,output=$6,iscompiled=$7 WHERE id=$8',[program,language,input,cputime,memory,output,iscompiled,program_id]);
        client.release();
        res.json({message:"success"});
}
);

//delete specific program by program_id
app.delete('/deleteProgram',async(req,res)=>{
    const pool = new Pool({
        connectionString:"postgresql://sample_owner:KqUaJp6WYvH9@ep-tight-firefly-a5h8flpg.us-east-2.aws.neon.tech/Code_Compiler?sslmode=require",
    });
    const client = await pool.connect();
    const program_id = req.query.program_id;
    const result = await client.query('DELETE FROM compiled_programs WHERE id=$1',[program_id]);
    client.release();
    res.json({message:"success"});
}
);


app.listen(PORT,()=>{
    console.log('Server is running on',PORT);
});
