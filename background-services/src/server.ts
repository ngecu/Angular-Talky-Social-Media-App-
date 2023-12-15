import express from 'express'
import cron from 'node-cron'
import { deleteStatus, sendToCommentTaggedUsers, sendToPostTaggedUsers, welcomeUser } from './mailservices/welcomeUser'


const app = express()



const run = async()=>{
    cron.schedule('*/10 * * * * *', async()=>{
        console.log('Checking for a new user');
        
        await welcomeUser()
        console.log('Checking for expired status');
        await deleteStatus()
        console.log('Checking for post tagged users');

        await sendToPostTaggedUsers()
        console.log('Checking for comment tagged users');

        await sendToCommentTaggedUsers()

    })
    
}

run()


app.listen(4401, ()=>{
    console.log('Mail server up and running ...'); 
})