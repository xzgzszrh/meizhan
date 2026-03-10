<script setup>
import { inject } from 'vue'
import PageSection from '@/components/Base/PageSection.vue'
import AccountLinkCard from '@/components/Base/AccountLinkCard.vue'
import EditLoginVerification from '@/components/Pages/SignInAndSecurity/EditLoginVerification.vue'
import { Cog, KeyRound, Mail, Phone, Shield, ShieldCheck, SmartphoneNfc } from 'lucide-vue-next'

const userData = inject('userData')
</script>

<template>
  <PageSection
    title="登录与安全"
    :icon="Cog"
    badge="安全中心"
    description="统一管理邮箱、手机号、密码、多重验证以及登录保护策略。功能逻辑保持不变，仅界面全面重构为现代化中文体验。"
  >
    <AccountLinkCard
      title="邮箱"
      :icon="Mail"
      :desc="userData.email || '前往 Logto 账号中心添加邮箱'"
      path="/account/email"
    />
    <AccountLinkCard
      title="手机号"
      :icon="Phone"
      :desc="userData.phone_number || '前往 Logto 账号中心绑定手机号'"
      path="/account/phone"
    />
    <AccountLinkCard
      title="密码"
      :icon="KeyRound"
      desc="前往 Logto 账号中心更新登录密码"
      path="/account/password"
    />
    <AccountLinkCard
      title="Authenticator"
      :icon="ShieldCheck"
      desc="管理验证器应用（Google/Microsoft Authenticator）"
      path="/account/authenticator-app"
    />
    <AccountLinkCard
      title="备份码生成"
      :icon="Shield"
      desc="生成新的备用恢复码"
      path="/account/backup-codes/generate"
    />
    <AccountLinkCard
      title="备份码管理"
      :icon="Shield"
      desc="查看或重置现有备用恢复码"
      path="/account/backup-codes/manage"
    />
    <AccountLinkCard
      title="Passkey 添加"
      :icon="SmartphoneNfc"
      desc="添加新的 Passkey 登录方式"
      path="/account/passkey/add"
    />
    <AccountLinkCard
      title="Passkey 管理"
      :icon="SmartphoneNfc"
      desc="查看并管理已绑定的 Passkey"
      path="/account/passkey/manage"
    />
    <EditLoginVerification />
  </PageSection>
</template>

<style scoped></style>
