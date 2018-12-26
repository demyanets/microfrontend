import { Destroyable } from './destroyable';

class DummyDestroyable extends Destroyable {
    constructor() {
        super();
    }
}

let mock: DummyDestroyable;

beforeEach(() => {
    mock = new DummyDestroyable();
});

describe('Destroyable', () => {
    it('should destroy the object', () => {
        mock.destroy();
        expect(mock.isDestroyed()).toBeTruthy();
    });

    it('should not destroy the object', () => {
        expect(mock.isDestroyed()).toBeFalsy();
    });

    it('should throw error if object was aleady destroyed', () => {
        mock.destroy();
        expect(() => mock.preventUsageUponDestruction()).toThrow();
    });

    it('should not thow error if object was not destroyed', () => {
        expect(() => mock.preventUsageUponDestruction()).not.toThrow();
    });
});
