import { Stack } from "expo-router";

export default function CartLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="checkout"
       options={{
        headerShown: false,
       }}
      />
    </Stack>
  );
}
