import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing'
describe('AuthService', () => {
  let service: AuthService;
  let httpMock : HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController)
  });

  it('should create an user', ()=>{
    let mockUser ={
      profileImage:"https://res.cloudinary.com/dqquyjsap/image/upload/v1702401134/x7uybc4bmysvedyzgbvs.jpg",
      fullName:"Caleb ",
      email: "caleb@gmail.com",
      password: "12345678",
      username:"caleb",
      phone_no:"0791885527"
    }

    service.createUser(mockUser).subscribe(res=>{
      expect(res).toEqual({"message": 'User registered successfully'})
    })

    const req = httpMock.expectOne('http://localhost:4400/user/register');
    expect(req.request.method).toEqual('POST')
    expect(req.request.body).toBe(mockUser)

    req.flush({"message": "User registered successfully"})
  })

});
