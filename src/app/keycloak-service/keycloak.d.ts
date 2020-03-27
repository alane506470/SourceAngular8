declare module KeycloakModule {

  export interface Promise {
      success(callback: Function): Promise;
      error(callback: Function): Promise;
  }

  export type ResponseModes = "query" | "fragment";
  export type Flows = "standard" | "implicit" | "hybrid";

  export interface InitOptions {
      checkLoginIframe?: boolean;
      checkLoginIframeInterval?: number;
      onLoad?: string;
      adapter?: string;
      responseMode?: ResponseModes;
      flow?: Flows;
      token?: string;
      refreshToken?: string;
      idToken?: string;
      timeSkew?: number;
  }

  export interface LoginOptions {
      redirectUri?: string;
      prompt?: string;
      maxAge?: number;
      loginHint?: string;
      action?: string;
      locale?: string;
  }

  export interface LogoutOptions {
      redirectUri?: string;
  }

  export interface RedirectUriOptions {
      redirectUri?: string;
  }

  export interface KeycloakClient {
      init(options?: InitOptions): Promise;
      login(options?: LoginOptions): Promise;
      logout(options?: LogoutOptions): Promise;
      createLoginUrl(options?: LoginOptions): string;
      updateToken(options?: RedirectUriOptions): Promise;
      createLogoutUrl(options?: RedirectUriOptions): string;
      register(options?: LoginOptions): Promise;
      createRegisterUrl(options?: RedirectUriOptions): string;
      accountManagement(): Promise;
      createAccountUrl(options?: RedirectUriOptions): string;
      hasRealmRole(role: string): boolean;
      hasResourceRole(role: string, resource?: string): boolean;
      loadUserProfile(): Promise;
      isTokenExpired(minValidity: number): boolean;
      updateToken(minValidity: number): Promise;
      clearToken(): any;

      realm: string;
      clientId: string;
      authServerUrl: string;

      token: string;
      tokenParsed: any;
      refreshToken: string;
      refreshTokenParsed: any;
      idToken: string;
      idTokenParsed: any;
      realmAccess: any;
      resourceAccess: any;
      authenticated: boolean;
      subject: string;
      timeSkew: number;
      responseMode: ResponseModes;
      flow: Flows;
      responseType: string;

      onReady: Function;
      onAuthSuccess: Function;
      onAuthError: Function;
      onAuthRefreshSuccess: Function;
      onAuthRefreshError: Function;
      onAuthLogout: Function;
      onTokenExpired: Function;
  }
}

// declare var Keycloak: {
//   new(config?: any): KeycloakModule.KeycloakClient;
// };
