import { logger, Errors } from "../log";
import { firebaseApi } from "../firebase/firebase-api";
class ElectionApi {
    static createEndpoints(app) {
        app.get("/elections", function (req, res) {
            logger.message("GET /elections", logger.parseExpress(req, res));
            return ElectionApi.getElections(req, res);
        });
    }
    static getElections(req, res) {
        try {
            return firebaseApi
                .firestore()
                .collection("elections")
                .get()
                .then(function (data) {
                const elections = [];
                data.docs.forEach(function (doc) {
                    elections.push(doc.data());
                });
                return res.json(elections);
            })
                .catch(function (err) {
                return Errors.onCatch(res, err);
            });
        }
        catch (error) {
            return Errors.onCrash(res, error);
        }
    }
}
export { ElectionApi };
//# sourceMappingURL=elections.js.map