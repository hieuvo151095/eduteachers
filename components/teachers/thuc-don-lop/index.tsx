'use client'

import { useState } from 'react'
import {
  MOCK_CLASSES,
  MOCK_FOOD_MENUS,
  TODAY_STR,
  type ClassInfo,
  type FoodItem,
  type Ingredient,
} from '@/lib/mock-data'
import { FoodMenuScreen } from './food-menu-screen'
import { ClassSwitcher } from './class-switcher'
import { DateCarousel } from './date-carousel'
import { IngredientListModal } from './ingredient-list-modal'
import { IngredientDetails } from './ingredient-details'

interface ThucDonLopAppProps {
  onBack: () => void
}

export function ThucDonLopApp({ onBack }: ThucDonLopAppProps) {
  // Default to Lớp 6A2 (class-7 — homeroom)
  const [selectedClass, setSelectedClass] = useState<ClassInfo>(
    MOCK_CLASSES.find((c) => c.id === 'class-7') ?? MOCK_CLASSES[0]
  )
  const [selectedDate, setSelectedDate] = useState<string>(TODAY_STR)

  // Modals
  const [showClassSwitcher, setShowClassSwitcher] = useState(false)
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null)
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null)

  const classMenusByDate = MOCK_FOOD_MENUS[selectedClass.id] ?? {}
  const foodMenu = classMenusByDate[selectedDate]

  const handleClassSelect = (cls: ClassInfo) => {
    setSelectedClass(cls)
    setShowClassSwitcher(false)
  }

  const handleFoodClick = (food: FoodItem) => {
    setSelectedFood(food)
    setSelectedIngredient(null)
  }

  const handleIngredientClick = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient)
  }

  const handleBackFromDetails = () => {
    setSelectedIngredient(null)
    // selectedFood stays open — ingredient list reappears
  }

  const handleCloseIngredientList = () => {
    setSelectedFood(null)
    setSelectedIngredient(null)
  }

  return (
    <div className="relative flex flex-col bg-white">
      {/* Main content */}
      <FoodMenuScreen
        selectedClass={selectedClass}
        foodMenu={foodMenu}
        selectedDate={selectedDate}
        onBack={onBack}
        onClassSwitch={() => setShowClassSwitcher(true)}
        onFoodClick={handleFoodClick}
      />

      {/* Date carousel — sticky at bottom of the food list */}
      <DateCarousel selectedDate={selectedDate} onDateChange={setSelectedDate} />

      {/* Class switcher bottom sheet */}
      {showClassSwitcher && (
        <ClassSwitcher
          selectedClassId={selectedClass.id}
          classes={MOCK_CLASSES}
          onSelect={handleClassSelect}
          onClose={() => setShowClassSwitcher(false)}
        />
      )}

      {/* Ingredient list bottom sheet (level 1) — only visible when no ingredient selected */}
      {selectedFood && !selectedIngredient && (
        <IngredientListModal
          food={selectedFood}
          onIngredientClick={handleIngredientClick}
          onClose={handleCloseIngredientList}
        />
      )}

      {/* Ingredient source details (level 2) */}
      {selectedIngredient && (
        <IngredientDetails
          ingredient={selectedIngredient}
          onBack={handleBackFromDetails}
        />
      )}
    </div>
  )
}
