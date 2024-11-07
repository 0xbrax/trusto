import axios from 'axios';
import {notFound} from 'next/navigation';

export default async function Poll({params}: any) {
    const {id} = await params;

    let pollData;

    const getPoll = async () => {
        try {
            const {data} = await axios.get(`/api/get-poll?pollId=${id}`);
            pollData = data;
        } catch (error) {
            console.error(error);
            notFound();
        }
    };

    await getPoll();

    return (
        <div>
            POLL ID {id}
            {JSON.stringify(pollData)}
        </div>
    )
}
