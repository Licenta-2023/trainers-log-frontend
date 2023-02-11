import {Injectable} from "@angular/core";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {catchError, mergeMap, Observable, of, switchMap, take, throwError} from "rxjs";
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";

@Injectable({providedIn: 'root'})
export class AuthInterceptor implements HttpInterceptor{
  constructor(private authService: AuthService, private router: Router) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.loggedUserData.pipe(
      take(1),
      mergeMap(userData => {
        if (!userData || req.headers.has('Authorization')) {
          return next.handle(req);
        }

        const authenticatedRequest = req.clone({
          headers: req.headers.set('Authorization', 'Bearer ' + userData.access_token),
        });

        return next.handle(authenticatedRequest).pipe(
          catchError((error: HttpErrorResponse) => {
            const expiredTokenMessage = 'The Token has expired on';
            const errorMessage = error.error.error_message;
            if(error.status === 403 && errorMessage.startsWith(expiredTokenMessage)) {
              //try refreshing the token
              return this.authService.refreshToken().pipe(
                switchMap((refreshedUserData) => {
                  const authenticatedRequestWithNewRefreshToken = req.clone({
                    headers: req.headers.set('Authorization', 'Bearer ' + refreshedUserData.refresh_token),
                  });
                  this.authService.loggedUserData.next(refreshedUserData);

                  return next.handle(authenticatedRequestWithNewRefreshToken);
                }),
                catchError((refreshError) => {
                  this.authService.logOut();
                  this.router.navigate(['/log-in']);
                  return of(refreshError);
                })
              );
            }
            return throwError(() => error);
          })
        );
      })
    )
  }
}
