

export const CategorySettingsMenu = [
  {
    id: 100,
    name: "Mark as Read",
    showBorder: true
  },
  {
    id: 101,
    name: "Collapse Category"
  },
  {
    id: 102,
    name: "Collapse All Categories",
    showBorder: true
  },
  {
    id: 103,
    name: "Mute Category",
    settingOptions: [
      {
        id: 201,
        name: "15 minutes"
      },
      {
        id: 202,
        name: "1 hour"
      },
      {
        id: 203,
        name: "3 hours"
      },
      {
        id: 204,
        name: "8 hours"
      },
      {
        id: 205,
        name: "24 hours"
      },
      {
        id: 206,
        name: "Until I turn it back on"
      },
    ]
  },
  {
    id: 104,
    name: "Notification Settings",
    settingOptions: [
      {
        id: 207,
        name: "Use Server Default"
      },
      {
        id: 208,
        name: "All Messages"
      },
      {
        id: 209,
        name: "Only @mentions"
      },
      {
        id: 210,
        name: "Nothing"
      }
    ],
    showBorder: true
  },
  {
    id: 105,
    name: "Edit Category"
  },
  {
    id: 106,
    name: "Delete Category",
    showBorder: true
  },
  {
    id: 107,
    name: "Copy Category ID"
  }
]

export const CategorySettingsOptions = [
  {
    id: 101,
    name: "Overview"
  },
  {
    id: 102,
    name: "Permissions"
  },
  {
    id: 103,
    name: "Delete Category"
  }
]
