const Filters = {
    sold: {id: "sold", name:"Sold", list: [true, false]},
    category: { id: "category", name: "Category", list: ["Upper Thread", "Lower Thread", "Footwear"] },
    sizeG: { id: "sizeG", name: "Garment Size", list: ["XS", "S", "M", "L", "XL", "XXL"] },
    sizeF: { id: "sizeF", name: "Foot Size", list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15] },
    condition: { id: "condition", name: "Condition", list: ["New", "Like New", "Used", "Damaged"] },
    color: {
        id: "color", name: "Color", list: ["Blue", "Red", "Yellow", "Brown", "White",
            "Black", "Pink", "Green", "Purple", "Orange",
            "Gray", "Beige", "Camoflauge", "Tie-Dye"
        ]
    },
    price: { id: "price", name: "Price", list: [0, 100000] }
}

export { Filters };