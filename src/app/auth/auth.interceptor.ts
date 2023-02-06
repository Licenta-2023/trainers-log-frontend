import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {mergeMap, Observable, take} from "rxjs";
import {AuthService} from "./auth.service";

@Injectable({providedIn: 'root'})
export class AuthInterceptor implements HttpInterceptor{
  constructor(private authService: AuthService) {
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.loggedUserData.pipe(
      take(1),
      mergeMap(userData => {
        if (!userData) {
          return next.handle(req);
        }

        const authenticatedRequest = req.clone({
          headers: req.headers.set('Authorization', 'Bearer ' + userData.access_token),
        });
        return next.handle(authenticatedRequest);
      })
    )
  }
}
