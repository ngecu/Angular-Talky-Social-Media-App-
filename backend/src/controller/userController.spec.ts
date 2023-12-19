import mssql from "mssql";
import bcrypt from "bcrypt";
import { Request } from "express";
import jwt from "jsonwebtoken";
import { loginUser, registerUser } from "./userController";

describe("User Registration", () => {
  let res: any;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });


  it("registers a user using dbhelpers", async () => {
    const req = {
      body: {
        profileImage:"https://avatars.githubusercontent.com/u/65470823?v=4",
        fullName:"Caleb ",
        email: "caleb@gmail.com",
        password: "12345678",
        
        username:"caleb",
        phone_no:"0791885527"      },
    };

    jest
      .spyOn(bcrypt, "hash")
      .mockResolvedValueOnce("HashedPass@word123" as never);

    const mockedInput = jest.fn().mockReturnThis();

    const mockedExecute = jest.fn().mockResolvedValue({ rowsAffected: [1] });

    const mockedRequest = {
      input: mockedInput,
      execute: mockedExecute,
    };

    const mockedPool = {
      request: jest.fn().mockReturnValue(mockedRequest),
    };

    jest.spyOn(mssql, "connect").mockResolvedValue(mockedPool as never);

    await registerUser(req as Request, res as never);

        expect(res.json).toHaveBeenCalledWith({
          message: "User registered successfully",
        });
        expect(res.status).toHaveBeenCalledWith(200)
  });
  
  it("failed to register", async () => {
    const req = {
      body: {
        // name: "Robin",
        profileImage:"https://res.cloudinary.com/dqquyjsap/image/upload/v1702401134/x7uybc4bmysvedyzgbvs.jpg",
        email: "caleb@gmail.com",
        password: "12345678",
        username:"caleb",
        phone_no:"0791885527"
      },
    };

    jest
      .spyOn(bcrypt, "hash")
      .mockResolvedValueOnce("HashedPass@word123" as never);

    const mockedInput = jest.fn().mockReturnThis();

    const mockedExecute = jest.fn().mockResolvedValue({ rowsAffected: [1] });

    const mockedRequest = {
      input: mockedInput,
      execute: mockedExecute,
    };

    const mockedPool = {
      request: jest.fn().mockReturnValue(mockedRequest),
    };

    jest.spyOn(mssql, "connect").mockResolvedValue(mockedPool as never);

    await registerUser(req as Request, res as never);

        expect(res.json).toHaveBeenCalledWith({
          error: "\"fullName\" is required"
        });
        expect(res.status).toHaveBeenCalledWith(404)
  });

});

describe("User Login",()=>{

  let res: any;
  let req:any;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

      it("Returns an error if email or password is empty", async () => {
        const req = {
          body: {
            email: "",
            password: "",
          },
        };

        await loginUser(req as Request, res);

        expect(res.json).toHaveBeenCalledWith({
          error: '"email" is not allowed to be empty',
        });
      });
it('Returns an error if email or password is missing' ,async()=>{
    const req = {
        body:{
            
        }
    }

    await loginUser(req as Request, res)

    expect(res.json).toHaveBeenCalledWith({"error": "\"email\" is required"})

})

it("Returns an error if email is not in database", async()=>{
    const req = {
        body:{
            email: "incorrect@email.com",
            password: "12345678"
        } 
    }

    jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
        request: jest.fn().mockReturnThis(),
        input: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValueOnce({recordset: []})
    } as never)

    await loginUser(req as Request, res)

    expect(res.json).toHaveBeenCalledWith({error: "User not found"}) 
})

it("Handles incorrect password scenario", async()=>{
    const req = {
        body:{
            email: "caleb@gmail.com",
            password: "wrongpassword"
        }
    }

    jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
        request: jest.fn().mockReturnThis(),
        input: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValueOnce({
            recordset: [{
                email: 'caleb@gmail.com',
                password: 'hashedPwd'
            }]
        })
    } as never)

    jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false as never)

    await loginUser(req as Request, res)

    expect(res.json).toHaveBeenCalledWith({error: "Incorrect password"})
})

it("Handles A deactivated account", async()=>{
  const req = {
      body:{
          email: "caleb@gmail.com",
          password: "12345678"
      }
  }

  jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
      request: jest.fn().mockReturnThis(),
      input: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValueOnce({
          recordset: [{
              email: 'caleb@gmail.com',
              password: '12345678'
          }]
      })
  } as never)

  jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false as never)

  await loginUser(req as Request, res)

  expect(res.json).toHaveBeenCalledWith({error: "Account deactivated, please contact admin"})
})

it("successfully logs in a user and returns a token", async()=>{

    let expectedUser = {
        user_id: "0c7212ca-b57d-4913-b021-de4dc7f467a8",
        fullName: "Caleb ",
      email: "caleb@gmail.com",
      password:
        "$2b$05$PGy/fdLf.9fHHrdJo1zvJOkspY7P2Iz0RFvy9l5650Iqt7BNwzrqi",
      welcomed: 0,
    };

    const req = {
        body:{
            email: expectedUser.email,
          password: "12345678"
        }
    }

    jest.spyOn(mssql, 'connect').mockResolvedValueOnce({
        request: jest.fn().mockReturnThis(),
        input: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValueOnce({recordset: [expectedUser]})
    } as never)

    jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true as never)

    jest.spyOn(jwt, 'sign').mockReturnValueOnce("generate-token-jghjg-jyiugjxz-mmhjruyiu" as never)

    await loginUser(req as Request, res)

    expect(res.json).toHaveBeenCalledWith({
        message: "Logged in successfully",
        token: "generate-token-jghjg-jyiugjxz-mmhjruyiu"
    })

})

})