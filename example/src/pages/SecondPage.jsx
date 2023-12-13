import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import ItemCard from "../../../components/LargeItemCard";
import config from "../../config";
export default function SecondPage() {
  const items = [
    {
      id: "1",
      name: "Software Team",
      createdAt: new Date(),
      icon: ":box:",
    },
  ];

  const subItem = [
    {
      id: "1",
      name: "Software Team",
      createdAt: new Date(),
    },
    {
      id: "2",
      name: "Design Team",
      createdAt: new Date(),
    },
    {
      id: "3",
      name: "Marketing Team",
      createdAt: new Date(),
    },
    {
      id: "4",
      name: "HR Team",
      createdAt: new Date(),
    },
  ];
  return (
    <Stack spacing={1} alignItems="center">
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: "repeat(1, 1fr)",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
        }}
      >
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            subItem={subItem}
            subItemName="Services"
            base={config.base}
          />
        ))}
      </Box>
    </Stack>
  );
}
