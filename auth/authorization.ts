import { Enforcer } from 'casbin';

export class BasicAuthorizer {
    private req: any;
    private enforcer: any;

    constructor(req, enforcer) {
        this.req = req;
        this.enforcer = enforcer;
    }

    getUserRole() {
        const { user } = this.req;
        const { role } = user;
        return role;
    }

    async checkPermission() {
        const { req, enforcer } = this;
        const { originalUrl: path, method } = req;
        const userRole = this.getUserRole();
        const isAllowed=await enforcer.enforce(userRole, path, method);
        return true;
    }
}

// the authorizer middleware
export function authorize(newEnforcer: () => Promise<Enforcer>) {
    return async (req, res, next) => {
        const enforcer = await newEnforcer();

        // user sample
        req.user = {role: 'admin'};

        if(!(enforcer instanceof Enforcer)) {
            res.status(500).json({500: 'Invalid enforcer'});
            return;
        }

        const authorizer = new BasicAuthorizer(req, enforcer);
        var isAllowed=await authorizer.checkPermission();
        if(!isAllowed) {
            res.status(403).json({403: 'Forbidden'});
            return;
        }

        next();
    }
};