import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

// array in local storage for registered users


let modelsData=[
                    {"firstName":"test",
                    "phoneNumber":"099999990",
                    "twilioPhone":"+16127121331",
                    "lastName":"test",
                    "username":"test",
                    "password":"testtest",
                    "id":1,
                    "sex":"man",
                    "desc":"Test passionate about love super hot European Brunette Babe 773-817-7912 No African American Guys !!! ",
                    "interests":"Anal Sex, BDSM, Bondage, Cum Eating, Exhibitionism, Group Sex, Interracial Sex, Older Men, Oral Sex, Public Sex, Rough Sex, Sex Toys, Softcore Chat, Younger Men, ",
                    "specialites":"Anything Goes, Daddy/Daughter, Discipline, Masturbation Instruction, No Taboo, Orgasm Denial/Control, Porn Star, Sex Advice, Dating Advice, Relationship Advice, "
                    },
                    {
                        "firstName":"Christabel",
                        "lastName":"Evan",
                        "phoneNumber":"088888888",
                        "twilioPhone":"+16124319058",
                        "username":"test1",
                        "password":"123456",
                        "id":2,
                        "sex":"man",
                        "desc":"Christabel Evan passionate about love super hot European Brunette Babe 773-817-7912 No African American Guys !!!",
                        "interests":"Anal Sex, BDSM, Bondage, Cum Eating, Exhibitionism, Group Sex, Sex Toys, Softcore Chat, Younger Men, ",
                        "specialites":"Anything Goes, Daddy/Daughter, Discipline, Feminization, Fetish, Financial Domination, Humiliation, Masturbation Instruction, No Taboo, Orgasm Denial/Control, Porn Star, Sex Advice, Dating Advice, Relationship Advice, ",
                    },
                    {
                        "firstName":"Ivan ",
                        "phoneNumber":"088888888",
                        "twilioPhone":"+16122611062",
                        "lastName":"Shank",
                        "username":"thaiha",
                        "password":"123456",
                        "sex":"man",
                        "id":3,
                        "desc":"Christabel Evan passionate about love super hot European Brunette Babe 773-817-7912 No African American Guys !!!",
                        "interests":"Interracial Sex, Older Men, Oral Sex, Public Sex, Rough Sex, Sex Toys, Softcore Chat, Younger Men, ",
                        "specialites":"Anything Goes, Daddy/Daughter, Discipline, Feminization, Fetish, Financial Domination "
                    }];
let userData=[{"firstName":"test","lastName":"test","username":"test","password":"testtest","id":1},{"firstName":"Christabel","lastName":"Evan","username":"test1","password":"123456","id":2},{"firstName":"Ivan ","lastName":"Shank","username":"thaiha","password":"123456","id":3}];
function createFakeData(){
    // localStorage.setItem('users',JSON.stringify(userData));
    // localStorage.setItem('users',JSON.stringify(modelsData)) ;
}
// let users = JSON.parse(localStorage.getItem('users')) || createFakeData();
// let models = JSON.parse(localStorage.getItem('users')) || createFakeData();
 let users ;
 let models ;
@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/users/register') && method === 'POST':
                    return register();
                case url.endsWith('/users') && method === 'GET':
                    return getUsers();
                case url.endsWith('/users/all') && method === 'GET':
                    return getAllUsers();
                case url.match(/\/users\/\d+$/) && method === 'DELETE':
                    return deleteUser();
                case url.match(/\/model\/\d+$/) && method === 'GET':
                    return getModelInfo();
                    case url.match(/\/model\/get\/\d+$/) && method === 'GET':
                        return getListModel();
                    
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }    
        }

        // route functions

        function authenticate() {
            const { username, password } = body;
            const user = users.find(x => x.username === username && x.password === password);
            if (!user) return error('Username or password is incorrect');
            return ok({
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                token: 'fake-jwt-token'
            })
        }

        function register() {
            const user = body

            if (users.find(x => x.username === user.username)) {
                return error('Username "' + user.username + '" is already taken')
            }

            user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
            users.push(user);
            localStorage.setItem('users', JSON.stringify(users));

            return ok();
        }

        function getUsers() {
            if (!isLoggedIn()) return unauthorized();
            return ok(users);
        }

        function deleteUser() {
            if (!isLoggedIn()) return unauthorized();

            users = users.filter(x => x.id !== idFromUrl());
            localStorage.setItem('users', JSON.stringify(users));
            return ok();
        }

        // helper functions

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
        }

        function error(message) {
            return throwError({ error: { message } });
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function isLoggedIn() {
            return headers.get('Authorization') === 'Bearer fake-jwt-token';
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }

        function getAllUsers(){
            return ok(users);
        }

        function getModelInfo(){
            let model = models.filter(x => x.id === idFromUrl());
            if(model.length){
                return ok(model);
            }
            return throwError({ status: 401, error: { message: 'Clairvoyant not Found' } });
        }

        function getListModel(){
            
            let model = models.slice(0, 3);
            if(model.length){
                return ok(model);
            }
           
            return throwError({ status: 401, error: { message: 'Clairvoyant not Found' } });
        }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};