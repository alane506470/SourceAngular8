import { KeycloakService } from 'keycloak-angular';
import { environment } from '../../environments/environment';

export function initializer(keycloak: KeycloakService): () => Promise<any> {
  return (): Promise<any> => keycloak.init(
    {config: {
      realm: environment.keycloakRealm,
      'url': environment.AuthHost,
      'clientId': 'backoffice-angular',
    },
    initOptions: {
      onLoad: 'login-required', // redirects to the login page
      checkLoginIframe: false
    }
    }
  );
}
