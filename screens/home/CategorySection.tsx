import React from "react";
import SectionHeader from "../../components/home/SectionHeader";
import CategoryGrid from "../../components/home/CategoryGrid";

const CategorySection = ({ navigation, activeCategory, setActiveCategory }: any) => {
  const categories = [
    { id: "1", name: "Electronics", icon: "smartphone", count: 124 },
    { id: "2", name: "Fashion", icon: "shopping-bag", count: 89 },
    { id: "3", name: "Home", icon: "home", count: 67 },
    { id: "4", name: "Beauty", icon: "heart", count: 45 },
    { id: "5", name: "Sports", icon: "activity", count: 32 },
    { id: "6", name: "Books", icon: "book", count: 28 },
  ];

  return (
    <>
      <SectionHeader title="Shop by Category" rightText="See all" onRightPress={() => navigation.navigate("Categories")} />
      <CategoryGrid categories={categories} onCategoryPress={(cat: any) => setActiveCategory(cat.id)} activeCategory={activeCategory} />
    </>
  );
};

export default CategorySection;
