import { logger, Errors } from "../log";
import { firebaseApi } from "../firebase/firebase-api";
class CandidateApi {
    static createEndpoints(app) {
        app.get("/candidates", function (req, res) {
            logger.message("GET /candidates", logger.parseExpress(req, res));
            return CandidateApi.getCandidates(req, res);
        });
    }
    static getCandidates(req, res) {
        const electionId = req.query.id;
        try {
            return firebaseApi
                .firestore()
                .collection("candidates")
                .where("electionId", "==", electionId)
                .get()
                .then(function (data) {
                const candidates = [];
                data.docs.forEach(function (doc) {
                    candidates.push(doc.data());
                });
                return res.json(candidates);
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
export { CandidateApi };
//# sourceMappingURL=candidates.js.map