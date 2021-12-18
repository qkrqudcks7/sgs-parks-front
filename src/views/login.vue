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
    <a-modal ref="modal" v-model="visible" title="회원가입" :ok-button-props="{ props: { disabled: (check === false || emailCheck === false) ? true : false } }" @ok="signUpForm" ok-text="가입" cancel-text="취소">
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
                  :disabled="check"
                  @blur="
              () => {
                $refs.email.onFieldBlur();
              }
            ">
              </a-input>
            </a-col>
            <a-col flex="2">
              <a-button type="danger" @click="doubleCheck" :disabled="check">
                {{check ? "완료" : "중복 인증"}}
              </a-button>
            </a-col>
          </a-row>
        </a-form-model-item>
        <a-form-model-item label="인증">
          <a-row type="flex">
            <a-col flex="4">
              <small>
                이메일 인증을 해주세요.
              </small>
            </a-col>
            <a-col flex="2">
              <a-button type="danger" @click="emailChk" :disabled="emailCheck">
                {{emailCheck ? "완료" : "이메일 인증"}}
              </a-button>
            </a-col>
          </a-row>
        </a-form-model-item>
        <a-form-model-item ref="emailCheckingState" label="인증 코드" prop="emailCheckingState">
          <a-row type="flex">
            <a-col flex="4">
              <a-input
                  v-model="codeNumber2"
                  placeholder="인증코드를 입력하세요"
              >
              </a-input>
            </a-col>
            <a-col flex="2">
              <a-button type="danger" @click="codeCheck" :disabled="codeCheckState">
                {{codeCheckState ? "완료" :"확인"}}
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
      emailCheckingState: "",
      codeCheckState: false,
      codeNumber: '',
      codeNumber2: '',
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
    ...mapGetters("account",["user","authToken"]),
  },
  methods: {
    ...mapMutations("account", ["setUser","setAuthToken"]),
    handleSubmit(e) {
      e.preventDefault();
      apis.users
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
          }).catch(() => {
        alert("아이디와 비밀번호를 확인하세요!")
      })
    },
    showModal() {
      this.visible = true
    },
    signUpForm() {
      apis.users
      .signUp({
        email: this.form.email,
        password: this.form.password,
        name: this.form.name
      })
      .then(res => {
        if (res.data) {
          console.log(res.data)
        }
      })
      this.visible = false
    },
    doubleCheck() {
      apis.users
      .doubleEmailCheck(this.form.email)
      .then(res => {
        if (res.data === false) {
          this.check = true
          alert("사용할 수 있는 이메일입니다.")
        } else {
          alert("이미 존재하는 이메일입니다.")
        }
      })
    },
    emailChk() {
      apis.users
      .sendEmail(this.form.email)
      .then(res => {
        if (res.status === 200) {
          alert("해당 이메일을 확인해주세요.")
          this.codeNumber = res.data
        }
      })
      this.emailCheck = true
      this.emailCheckingState = "인증 완료"
    },
    codeCheck() {
      if (this.codeNumber === this.codeNumber2) {
        this.codeCheckState = true
      } else {
        alert("일치하지 않습니다.")
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