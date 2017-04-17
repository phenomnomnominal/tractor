// Constants:
const OKAY_STATUS = 200;

// Errors:
import { TractorError, handleError } from 'tractor-error-handler';

export function createTakeChangesHandler (fileStructure) {
    let { allFilesByPath } = fileStructure;

    return function takeChanges (request, response) {
        let { diff } = request.body;
        let baselineFile = allFilesByPath[diff.baseline.path];
        let changesFile = allFilesByPath[diff.changes.path];
        let diffFile = allFilesByPath[diff.diff.path];

        if (baselineFile && changesFile && diffFile) {
            return baselineFile.delete()
            .then(() => changesFile.move({ newPath: baselineFile.path }))
            .then(() => diffFile.delete())
            .then(() => response.sendStatus(OKAY_STATUS))
            .catch(() => handleError(response, new TractorError('Could not take changes')));
        }

        handleError(response, new TractorError('Could not take changes, the files no longer exist.'));
    }
}