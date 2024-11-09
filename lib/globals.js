export const formatDate = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };

    const formatter = new Intl.DateTimeFormat('it-IT', options);
    return formatter.format(date);
};

export const calculatePercentages = (pollAnswers, answers) => {
    const answerCounts = {};
    answers.forEach(answer => {
        answerCounts[answer] = answerCounts[answer] ? answerCounts[answer] + 1 : 1;
    });
    const totalAnswers = answers.length;

    return pollAnswers.map(answer => {
        const count = answerCounts[answer] || 0;
        const percentage = totalAnswers > 0 ? (count / totalAnswers) * 100 : 0;

        return {
            answer,
            percentage: `${percentage.toFixed(2)}%`
        };
    });
};