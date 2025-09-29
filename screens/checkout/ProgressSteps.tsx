// import React from "react";
// import { View, Text, StyleSheet } from "react-native";

// type Props = {
//   activeSection: "shipping" | "payment" | "review";
//   colors: {
//     text: string;
//     subtext: string;
//     accent: string;
//     border: string;
//   };
// };

// const ProgressSteps: React.FC<Props> = ({ activeSection, colors }) => {
//   const steps = ["shipping", "payment", "review"];

//   return (
//     <View style={styles.container}>
//       {steps.map((step, index) => {
//         const isActive = activeSection === step;
//         const isCompleted = steps.indexOf(activeSection) > index;

//         return (
//           <React.Fragment key={step}>
//             <View style={styles.stepContainer}>
//               <View
//                 style={[
//                   styles.circle,
//                   {
//                     backgroundColor: isActive
//                       ? colors.accent
//                       : isCompleted
//                       ? colors.accent
//                       : "transparent",
//                     borderColor: isActive || isCompleted ? colors.accent : colors.border,
//                   },
//                 ]}
//               >
//                 <Text
//                   style={{
//                     color: isActive || isCompleted ? "#fff" : colors.subtext,
//                     fontWeight: "700",
//                   }}
//                 >
//                   {index + 1}
//                 </Text>
//               </View>
//               <Text
//                 style={[
//                   styles.label,
//                   { color: isActive ? colors.accent : colors.subtext },
//                 ]}
//               >
//                 {step.charAt(0).toUpperCase() + step.slice(1)}
//               </Text>
//             </View>

//             {/* Divider between steps */}
//             {index < steps.length - 1 && (
//               <View
//                 style={[
//                   styles.line,
//                   { backgroundColor: isCompleted ? colors.accent : colors.border },
//                 ]}
//               />
//             )}
//           </React.Fragment>
//         );
//       })}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 32,
//     justifyContent: "space-between",
//   },
//   stepContainer: {
//     alignItems: "center",
//     flex: 1,
//   },
//   circle: {
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     borderWidth: 2,
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 6,
//   },
//   label: {
//     fontSize: 12,
//     fontWeight: "500",
//     textAlign: "center",
//   },
//   line: {
//     flex: 1,
//     height: 2,
//     marginHorizontal: 4,
//   },
// });

// export default ProgressSteps;
