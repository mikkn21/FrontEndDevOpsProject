import axios from 'axios';

const lokiEndpoint = 'http://<loki-host>:3100/loki/api/v1/push';

export const sendLogToLoki = async (message : string, level = 'info') => {
    const logEntry = {
        streams: [
            {
                stream: {
                    app: 'your-react-app',
                    level: level,
                },
                values: [
                    [
                        `${Date.now() * 1000000}`,
                        message
                    ]
                ]
            }
        ]
    };

    try {
        await axios.post(lokiEndpoint, logEntry, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
    } catch (error) {
        console.error('Failed to send log to Loki:', error);
    }
};
