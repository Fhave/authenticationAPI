# authenticationAPI
This is an API that aunthenticates users. It checks the role of the user and make sure they can only access their approved routes.

This has four types of users: admin, manager, staff and user. Each has the specific routes they can access.

It uses JWTs as a secure way to authenticate users and share information.

A seceret is used by the issuer to sign the JWT. The receiver of the JWT will verify the signature to ensure that the token hasn’t been altered after it was signed by the issuer.

![Screenshot](register.png)
![Screenshot](register2.png)
![Screenshot](login.png)
![Screenshot](login2.png)
![Screenshot](login3.png)
![Screenshot](protectedRoute.png)
![Screenshot](protectedRoute2.png)
![Screenshot](logout.png)