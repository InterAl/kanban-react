export default [
  { id: 1,
    title: "Card one title",
    description: "Card detailed description.",
    status: "todo",
    tasks: [
      {id: 1, name:"Task one", done:true},
      {id: 2, name:"Task two", done:false},
      {id: 3, name:"Task three", done:false}
    ]
  },
  { id: 2,
    title: "Card Two title",
    description: "Card detailed description",
    status: "in-progress",
    tasks: [ 
      {id: 4, name:"Task four", done:false},
      {id: 5, name:"Task five", done:false},
      {id: 6, name:"Task six", done:false},
      {id: 7, name:"Task seven", done:false}
    ]
  },
  { id: 3,
    title: "Card Three title",
    description: "Card detailed description",
    status: "done",
    tasks: []
  },
];
