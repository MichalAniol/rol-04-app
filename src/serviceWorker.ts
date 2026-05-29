const serviceWorker = async () => {
    if (!('serviceWorker' in navigator)) {
        return;
    }

    try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
            updateViaCache: 'none'
        });

        await registration.update();

        if (registration.waiting) {
            registration.waiting.postMessage({
                type: 'SKIP_WAITING'
            });
        }

        registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;

            if (!newWorker) {
                return;
            }

            newWorker.addEventListener('statechange', () => {
                if (
                    newWorker.state === 'installed' &&
                    navigator.serviceWorker.controller
                ) {
                    newWorker.postMessage({
                        type: 'SKIP_WAITING'
                    });
                }
            });
        });

        let refreshing = false;

        navigator.serviceWorker.addEventListener(
            'controllerchange',
            () => {
                if (refreshing) {
                    return;
                }

                refreshing = true;
                window.location.reload();
            }
        );
    } catch (err) {
        console.error('SW error:', err);
    }
};