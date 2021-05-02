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

describe('Destroyable', async () => {
    it('should destroy the object', async () => {
        mock.destroy();
        await expect(mock.isDestroyed()).toBeTruthy();
    });

    it('should not destroy the object', async () => {
        await expect(mock.isDestroyed()).toBeFalsy();
    });

    it('should throw error if object was aleady destroyed', async () => {
        mock.destroy();
        await expect(() => mock.preventUsageUponDestruction()).toThrow();
    });

    it('should not thow error if object was not destroyed', async () => {
        await expect(() => mock.preventUsageUponDestruction()).not.toThrow();
    });
});
