export type RefundItemProps = {
    id: string,
    name: string,
    category: string,
    amount: string,
    categoryImg: string
}

type ItemProps = React.ComponentProps<"a"> & {
    data: RefundItemProps
}

import { Link } from "react-router-dom";

export function RefundItem({ data, ...rest }: ItemProps) {
    return ( 
        <Link {...rest} className="flex items-center gap-3 p-2" to={`/refund/${data.id}`}>
            <img className="w-8 h-8" src={data.categoryImg} alt="" />

            <div className="flex flex-col flex-1">
                <strong className="text-gray-100">{data.name}</strong>
                <span className="text-xs text-gray-200">{data.category}</span>
            </div>

            <span>
                <small>R$</small>
                {data.amount}
            </span>
        </Link>
    )
}
