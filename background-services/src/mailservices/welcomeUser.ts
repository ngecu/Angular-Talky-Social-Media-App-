import ejs from 'ejs'
import mssql from 'mssql'
import dotenv from 'dotenv'
import { sqlConfig } from '../config/sqlConfig'
import { sendMail } from '../helpers/emailHelpers'
dotenv.config()

export const welcomeUser = async() =>{
    
    
    const pool = await mssql.connect(sqlConfig)
    console.log("pool is ",pool.connected);
    

    const users = await (await pool.request().query('SELECT * FROM users WHERE welcomed = 0')).recordset

    console.log(users);
    console.log("sdsdsd");

    for (let user of users){
        ejs.renderFile('templates/welcomeUser.ejs', {Name: user.fullName}, async(error, data)=>{
            let mailOptions = {
                from: process.env.EMAIL as string,
                to: user.email,
                subject: "You're In :)",
                html: data
            }

            try {
                // console.log("sending ",mailOptions);
                
                await sendMail(mailOptions)

                await pool.request().query('UPDATE Users SET welcomed = 1 WHERE welcomed = 0')

                console.log('Emails send to new users');
                
            } catch (error) {
                console.log(error);
                
            }
        })
    }
}

export const deleteStatus = async () => {
    try {
        const pool = await mssql.connect(sqlConfig);

        const statusPosts = await (await (pool.request().query("SELECT * FROM post WHERE postType = 'status'"))).recordset;

        const currentTime = new Date();

        for (const status of statusPosts) {
            const timeDifference = currentTime.getTime() - new Date(status.created_at).getTime();

            const hoursDifference = timeDifference / (1000 * 3600);

            if (hoursDifference > 24) {
                await pool.request().query(`DELETE FROM post WHERE post_id = '${status.post_id}'`);
                console.log(`Post with ID ${status.post_id} deleted.`);
            }
        }

        console.log("Deletion process completed.");

    } catch (error) {
        console.error("Error deleting posts:", error);
    }
};

export const sendToPostTaggedUsers = async () => {
    try {
        const pool = await mssql.connect(sqlConfig);

        // Fetch entries from post_user_tag where sent is 0
        const taggedUsers = await (await pool.request().query('SELECT * FROM comment_user_tag WHERE sent = 0')).recordset;

        for (const taggedUser of taggedUsers) {
            // Fetch user information
            const user = await (await pool.request().query(`SELECT * FROM Users WHERE user_id = '${taggedUser.user_id}'`)).recordset[0];

            if (user) {
                // Fetch post information
                const post = await (await pool.request().query(`SELECT * FROM comment WHERE comment_id = '${taggedUser.post_id}'`)).recordset[0];

                if (post) {
                    ejs.renderFile('templates/sendToCommentTaggedUsers.ejs', { Name: user.fullName, post_id: taggedUser.post_id, postContent: post.content,profileImage:user.profileImage }, async (error, data) => {
                        let mailOptions = {
                            from: process.env.EMAIL as string,
                            to: user.email,
                            subject: "Someone Tagged You",
                            html: data
                        };

                        try {
                            await sendMail(mailOptions);

                            // Update sent status in post_user_tag
                            await pool.request().query(`UPDATE comment_user_tag SET sent = 1 WHERE comment_user_tag_id = '${taggedUser.post_user_tag_id}'`);

                            console.log(`Email sent to tagged user with ID ${user.user_id}`);
                        } catch (error) {
                            console.log(error);
                        }
                    });
                }
            }
        }

        console.log('Email sent to tagged users.');

    } catch (error) {
        console.error('Error sending welcome emails to tagged users:', error);
    }
};


export const sendToCommentTaggedUsers = async () => {
    try {
        const pool = await mssql.connect(sqlConfig);

        // Fetch entries from post_user_tag where sent is 0
        const taggedUsers = await (await pool.request().query('SELECT * FROM comment_user_tag WHERE sent = 0')).recordset;

        for (const taggedUser of taggedUsers) {
            // Fetch user information
            const user = await (await pool.request().query(`SELECT * FROM Users WHERE user_id = '${taggedUser.user_id}'`)).recordset[0];

            if (user) {
                ejs.renderFile('templates/welcomeTaggedUser.ejs', { Name: user.first_name }, async (error, data) => {
                    let mailOptions = {
                        from: process.env.EMAIL as string,
                        to: user.email,
                        subject: "Someone Tagged You",
                        html: data
                    };

                    try {
                        await sendMail(mailOptions);

                        // Update sent status in post_user_tag
                        await pool.request().query(`UPDATE comment_user_tag SET sent = 1 WHERE post_user_tag_id = '${taggedUser.post_user_tag_id}'`);

                        console.log(`Email sent to tagged user with ID ${user.user_id}`);
                    } catch (error) {
                        console.log(error);
                    }
                });
            }
        }

        console.log('Email sent to tagged users.');

    } catch (error) {
        console.error('Error sending welcome emails to tagged users:', error);
    }
};