// src/components/Button.jsx
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native'
import { colors, radii, fontSizes } from '../theme'

export default function Button({ title, onPress, variant = 'gold', loading, disabled, style }) {
  const isGold = variant === 'gold'
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[{
        backgroundColor: isGold ? colors.gold : 'transparent',
        borderWidth: isGold ? 0 : 1,
        borderColor: colors.bg4,
        borderRadius: radii.md,
        paddingVertical: 14,
        alignItems: 'center',
        opacity: (disabled || loading) ? 0.6 : 1,
      }, style]}
    >
      {loading ? (
        <ActivityIndicator color={isGold ? '#000' : colors.text} />
      ) : (
        <Text style={{ color: isGold ? '#000' : colors.text, fontWeight: '600', fontSize: fontSizes.md }}>{title}</Text>
      )}
    </TouchableOpacity>
  )
}
