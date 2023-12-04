interface Payload {
    page: number;
    total: number;
    limit: number;
}
export const generatePageList = ({ page, limit, total }: Payload) => {
    return {
        current_page: page,
        from: (page - 1) * limit + 1,
        last_page: Math.ceil(total / limit),
        per_page: limit,
        to: page * limit,
        total: total,
    };
};
