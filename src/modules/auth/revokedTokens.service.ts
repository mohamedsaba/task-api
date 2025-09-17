import { Injectable } from "@nestjs/common";

@Injectable()
export class RevokedTokenService {
    private revokedTokens: Set<string> = new Set<string>();

    revokeToken(jti: string) {
        this.revokedTokens.add(jti);
    }

    isTokenRevoked(jti: string): boolean {
        return this.revokedTokens.has(jti);
    }
}
