<template>
  <a-form-model class="login" layout="inline" :model="formInline" @submit="handleSubmit" @submit.native.prevent>
    <a-form-model-item>
      <div class="title">SGS-Parks</div>
      <a-input v-model="formInline.email" placeholder="이메일을 입력해주세요">
        <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
      </a-input>
      <a-input v-model="formInline.password" type="password" placeholder="비밀번호를 입력해주세요">
        <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
      </a-input>
      <a-button
          type="primary"
          class="button"
          html-type="submit"
      >
        로그인
      </a-button>
      <a-button
          type="danger"
          class="button"
          @click="showModal"
      >
        회원가입
      </a-button>
    </a-form-model-item>
    <a-modal ref="modal" v-model="visible" title="회원가입" :ok-button-props="{ props: { disabled: (check === false || emailCheck === false) ? true : false } }" @ok="handleOk" ok-text="가입" cancel-text="취소">
      <a-form-model
          ref="ruleForm"
          :model="form"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
      >
        <a-form-model-item ref="name" label="이름" prop="name">
          <a-input
              v-model="form.name"
              placeholder="이름을 입력해주세요"
              @blur="
          () => {
            $refs.name.onFieldBlur();
          }
        "
          />
        </a-form-model-item>
        <a-form-model-item ref="email" label="이메일" prop="email">
          <a-row type="flex">
            <a-col flex="4">
              <a-input
                  v-model="form.email"
                  placeholder="이메일을 입력해주세요"
                  @blur="
              () => {
                $refs.email.onFieldBlur();
              }
            ">
              </a-input>
            </a-col>
            <a-col flex="2">
              <a-button type="danger" @click="doubleCheck">
                중복확인
              </a-button>
            </a-col>
          </a-row>
        </a-form-model-item>
        <a-form-model-item ref="email" label="인증" prop="email">
          <a-row type="flex">
            <a-col flex="4">
              <a-input
                  v-model="emailCheckingState"
                  disabled="true"
              >
              </a-input>
            </a-col>
            <a-col flex="2">
              <a-button type="danger" @click="emailChk">
                이메일 인증
              </a-button>
            </a-col>
          </a-row>
        </a-form-model-item>
        <a-form-model-item ref="password" label="패스워드" prop="password">
          <a-input
              v-model="form.password"
              type="password"
              placeholder="비밀번호를 입력해주세요"
              @blur="
          () => {
            $refs.password.onFieldBlur();
          }
        ">
            <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
          </a-input>
        </a-form-model-item>
        <a-form-model-item ref="passwordCheck" label="일치 확인" prop="passwordCheck">
          <a-input
              v-model="form.passwordCheck"
              type="password"
              placeholder="비밀번호를 다시 입력해주세요"
              @blur="
          () => {
            $refs.passwordCheck.onFieldBlur();
          }
        ">
            <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
          </a-input>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </a-form-model>
</template>

<script>
import { mapState, mapMutations, mapGetters } from "vuex";
import apis from "@/api/api.js"

export default {
  name: "login",
  data() {
    return {
      formInline: {
        email: '',
        password: '',
      },
      visible: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      check: false,
      emailCheck: false,
      emailCheckingState: "미인증",
      form: {
        name: '',
        email: '',
        password: '',
        passwordCheck: ''
      },
      rules: {
        name: [
          { required: true, message: '이름을 입력해주세요!', trigger: 'blur' },
          { min: 2, max: 5, message: '이름은 2~5글자로 입력해주세요.', trigger: 'blur' },
        ],
        email: [
          { required: true, message: '이메일을 입력하세요', trigger: 'blur' },
          { type: 'email', message: "이메일 형식으로 입력하세요", trigger: 'blur'}
        ],
        password: [
          { required: true, message: '비밀번호를 입력하세요', trigger: 'blur' },
          { min: 7, max: 15, message: '7~15자 사이로 입력하세요.', trigger: 'blur' },
        ],
        passwordCheck: [
          { required: true, message: '비밀번호를 입력하세요', trigger: 'blur' },
          { validator: this.passwordDoubleCheck}
        ]
      },
    };
  },
  mounted() {
    if (this.$route.params?.message) {
      if (this.$route.params?.message === "sessionOut") {
        this.$message.error("로그인 세션이 만료되었습니다. 재로그인이 필요합니다.")
      } else if (this.$route.params?.message === "logOut") {
        this.$message.info("정상 로그아웃 되었습니다.")
      }
    }
  },
  computed: {
    ...mapState("account",["user","authToken"]),
    ...mapGetters("account",["user","authToken"])
  },
  methods: {
    ...mapMutations("account", ["setUser","setAuthToken"]),
    handleSubmit(e) {
      e.preventDefault();
      apis.users.login
          .loginUser({
            email: this.formInline.email,
            password: this.formInline.password
          })
          .then(res => {
            if (res.data) {
              let userInfo = {
                email: res.data.email,
                name: res.data.name
              }
              this.setUser(userInfo)
              this.setAuthToken(res.data.accessToken)
              this.$router.replace("/main/dashboard")
            }
          }).catch(e => {
        console.log(e)
      })
    },
    showModal() {
      this.visible = true
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleOk(e) {
      console.log(e)
      this.visible = false
    },
    doubleCheck() {
      this.check = true
    },
    emailChk() {
      this.emailCheck = true
      this.emailCheckingState = "인증 완료"
    },
    passwordDoubleCheck(rule,value,callback) {
      const form = this.form;
      if (value && value !== form.getFieldValue('password')) {
        callback('Two passwords that you enter is inconsistent!');
      } else {
        callback();
      }
    }
  },
}
</script>

<style scoped>
.login {
  text-align: center;
  margin-top: 250px;
}
.title {
  font-size: xx-large;
  margin-bottom: 15px;
}
.button {
  width: 100%;
}
</style>